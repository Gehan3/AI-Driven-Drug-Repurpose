import express from "express"
import cors from "cors"
import { predictRouter } from "./api/predict.js"
import { drugsRouter } from "./api/drugs.js"
import { diseasesRouter } from "./api/diseases.js"
import { explainRouter } from "./api/explain.js"

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.use("/api", predictRouter)
app.use("/api", drugsRouter)
app.use("/api", diseasesRouter)
app.use("/api", explainRouter)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
