from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_data, build_drug_disease_map

app = FastAPI(title="Drug Repurpose API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

nodes, edges = load_data()
drugs, diseases = build_drug_disease_map(nodes, edges)

@app.get("/api/drugs")
def get_drugs(search: str = ""):
    q = search.lower().strip()
    if q:
        results = [d for d in drugs if q in d["name"].lower()]
    else:
        results = drugs
    return {"drugs": results, "total": len(results)}

@app.get("/api/diseases")
def get_diseases(search: str = ""):
    q = search.lower().strip()
    if q:
        results = [d for d in diseases if q in d["name"].lower()]
    else:
        results = diseases
    return {"diseases": results, "total": len(results)}

@app.get("/api/drug/{drug_id}")
def get_drug(drug_id: str):
    for d in drugs:
        if d["id"] == drug_id:
            return {"drug": d}
    return {"error": "Drug not found"}, 404

@app.get("/api/stats")
def get_stats():
    return {
        "total_drugs": len(drugs),
        "total_diseases": len(diseases),
        "total_treatments": sum(len(d["diseases"]) for d in drugs),
    }
