import { Router } from "express"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PREDICT_SCRIPT = resolve(__dirname, "../../predict.py")
const PYTHON_CMD = "python"
const TIMEOUT_MS = 90000

export const predictRouter = Router()

predictRouter.post("/predict", (req, res) => {
  const { drugName, diseaseName, confidenceThreshold = 0.5, topK = 5 } = req.body

  const inputJSON = JSON.stringify({
    drugName,
    diseaseName,
    confidenceThreshold,
    topK,
  })

  const proc = spawn(PYTHON_CMD, [PREDICT_SCRIPT], {
    stdio: ["pipe", "pipe", "pipe"],
  })

  let stdoutBuffers = []
  let stderrBuffers = []
  let timedOut = false

  const timer = setTimeout(() => {
    timedOut = true
    proc.kill("SIGTERM")
  }, TIMEOUT_MS)

  proc.stdout.on("data", (chunk) => {
    stdoutBuffers.push(chunk)
  })

  proc.stderr.on("data", (chunk) => {
    stderrBuffers.push(chunk)
  })

  proc.on("error", (err) => {
    clearTimeout(timer)
    if (res.headersSent) return
    console.error("Failed to spawn Python process:", err.message)
    res.status(500).json({
      error: `Python process failed to start: ${err.message}`,
    })
  })

  proc.on("close", (code) => {
    clearTimeout(timer)

    if (timedOut) {
      return res.status(504).json({
        error: `Prediction timed out after ${TIMEOUT_MS / 1000} seconds. Try a different drug/disease pair.`,
      })
    }

    if (code !== 0) {
      const stderr = Buffer.concat(stderrBuffers).toString().trim()
      console.error(`Python process exited with code ${code}:`, stderr)
      return res.status(500).json({
        error: `Model process exited with code ${code}: ${stderr || "Unknown error"}`,
      })
    }

    const stdout = Buffer.concat(stdoutBuffers).toString().trim()

    if (!stdout) {
      return res.status(500).json({
        error: "Model returned empty output. Check the Python pipeline.",
      })
    }

    try {
      const result = JSON.parse(stdout)

      if (result.error) {
        return res.status(422).json({ error: result.error })
      }

      result.processingTime = `${((Date.now() - req._startTime || 0) / 1000).toFixed(2)}s`
      result.timestamp = new Date().toISOString()

      res.json(result)
    } catch (parseErr) {
      console.error("Failed to parse Python stdout as JSON:", parseErr.message)
      console.error("Raw stdout:", stdout.slice(0, 500))
      res.status(500).json({
        error: "Invalid JSON response from model. Check the Python pipeline.",
      })
    }
  })

  req._startTime = Date.now()
  proc.stdin.write(inputJSON)
  proc.stdin.end()
})
