import pandas as pd
from pathlib import Path
import gzip

BASE_DIR = Path(__file__).resolve().parent.parent
HETIONET_DIR = BASE_DIR / "frontend" / "hetionet-data" / "hetnet" / "tsv"
def load_data():
    nodes = pd.read_csv(
        HETIONET_DIR / "hetionet-v1.0-nodes.tsv",
        sep="\t",
        low_memory=False,
    )
    edges = pd.read_csv(
        HETIONET_DIR / "hetionet-v1.0-edges.sif.gz",
        sep="\t",
        compression="gzip",
        low_memory=False,
    )
    return nodes, edges


def get_drugs(nodes):
    return nodes[nodes["kind"] == "Compound"][["id", "name"]].reset_index(drop=True)

def get_diseases(nodes):
    return nodes[nodes["kind"] == "Disease"][["id", "name"]].reset_index(drop=True)

def get_ctd_edges(edges):
    return edges[edges["metaedge"] == "CtD"]

def build_drug_disease_map(nodes, edges):
    drugs = get_drugs(nodes)
    diseases = get_diseases(nodes)
    ctd = get_ctd_edges(edges)

    drug_map = {}
    for _, row in drugs.iterrows():
        drug_map[row["id"]] = {"id": row["id"], "name": row["name"], "diseases": []}

    disease_map = {}
    for _, row in diseases.iterrows():
        disease_map[row["id"]] = {"id": row["id"], "name": row["name"]}

    for _, row in ctd.iterrows():
        drug_id = row["source"]
        disease_id = row["target"]
        if drug_id in drug_map and disease_id in disease_map:
            drug_map[drug_id]["diseases"].append(disease_map[disease_id])

    return list(drug_map.values()), list(disease_map.values())
