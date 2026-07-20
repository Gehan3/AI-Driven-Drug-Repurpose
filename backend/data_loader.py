import pandas as pd
from pathlib import Path
import gzip
import os
import io
import requests
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "hetionet-data" / "hetnet" / "tsv"

def load_data():
    nodes = pd.read_parquet(DATA_DIR / "nodes.parquet")
    edges = pd.read_parquet(DATA_DIR / "edges.parquet")
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
