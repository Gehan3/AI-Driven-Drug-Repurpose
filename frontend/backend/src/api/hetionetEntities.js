import { readFileSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const NODES_FILE = resolve(__dirname, "../../../hetionet-data/hetnet/tsv/hetionet-v1.0-nodes.tsv")

let cachedEntities = null

function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase()
}

function loadEntities() {
  if (cachedEntities) return cachedEntities

  const rows = readFileSync(NODES_FILE, "utf8").split(/\r?\n/)
  const drugs = []
  const diseases = []

  for (const row of rows.slice(1)) {
    if (!row) continue

    const [id, name, kind] = row.split("\t")
    if (!id || !name || !kind) continue

    if (kind === "Compound") {
      drugs.push({ id, name, kind })
    } else if (kind === "Disease") {
      diseases.push({ id, name, kind })
    }
  }

  drugs.sort((a, b) => a.name.localeCompare(b.name))
  diseases.sort((a, b) => a.name.localeCompare(b.name))

  cachedEntities = { drugs, diseases }
  return cachedEntities
}

export function searchEntities(kind, query, limit = 50) {
  const { drugs, diseases } = loadEntities()
  const source = kind === "drug" ? drugs : diseases
  const q = normalizeQuery(query)
  const max = Math.max(1, Math.min(Number(limit) || 50, 200))

  const results = q
    ? source.filter((entity) => entity.name.toLowerCase().includes(q))
    : source

  return {
    results: results.slice(0, max),
    total: results.length,
  }
}
