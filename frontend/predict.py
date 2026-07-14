import sys
import json
import re
import pickle
import time
from datetime import datetime
from pathlib import Path

HETIONET_DIR = Path(__file__).resolve().parent / "hetionet-data" / "hetnet" / "tsv"
GRAPH_CACHE_FILE = HETIONET_DIR / "graph_cache.pkl"


def log(msg):
    print(f"[timing] {msg}", file=sys.stderr, flush=True)


def load_hetionet():
    try:
        import pandas as pd
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "pandas is required only to rebuild graph_cache.pkl from Hetionet TSV files. "
            "Install backend/requirements.txt or restore hetionet-data/hetnet/tsv/graph_cache.pkl."
        ) from exc

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


def prediction_id():
    return "pred_" + str(time.time_ns())


def timestamp_now():
    return datetime.now().isoformat(sep=" ", timespec="microseconds")


def get_graph():
    if GRAPH_CACHE_FILE.exists():
        t0 = time.time()
        log(f"Loading cached graph from {GRAPH_CACHE_FILE.name} ...")
        with open(GRAPH_CACHE_FILE, "rb") as f:
            g = pickle.load(f)
        log(f"Graph cache load: {time.time() - t0:.2f}s")
        return g

    t0 = time.time()
    log("No cache found. Building graph from TSV ...")

    t1 = time.time()
    nodes = load_hetionet()
    log(f"TSV load (nodes+edges): {time.time() - t1:.2f}s")

    t1 = time.time()
    g = build_graph(*nodes)
    del nodes
    log(f"build_graph: {time.time() - t1:.2f}s")

    t1 = time.time()
    with open(GRAPH_CACHE_FILE, "wb") as f:
        pickle.dump(g, f, protocol=pickle.HIGHEST_PROTOCOL)
    log(f"Graph pickle saved ({GRAPH_CACHE_FILE.stat().st_size / 1024 / 1024:.0f} MB): {time.time() - t1:.2f}s")
    log(f"Total graph build (no cache): {time.time() - t0:.2f}s")
    return g


def normalize_name(name):
    name = name.strip().lower()
    name = re.sub(r"['`]", "", name)
    name = re.sub(r"[-–—]", " ", name)
    name = re.sub(r"\s+", " ", name)
    return name


def build_graph(nodes, edges):
    drug_by_id = {}
    drug_by_name = {}
    disease_by_id = {}
    disease_by_name = {}
    gene_by_id = {}
    gene_by_name = {}
    pathway_by_id = {}
    pathway_by_name = {}

    for _, row in nodes.iterrows():
        kind = row["kind"]
        nid = row["id"]
        name = row["name"]
        norm = normalize_name(name)
        entry = {"id": nid, "name": name, "kind": kind}

        if kind == "Compound":
            drug_by_id[nid] = entry
            if norm not in drug_by_name:
                drug_by_name[norm] = entry
        elif kind == "Disease":
            disease_by_id[nid] = entry
            if norm not in disease_by_name:
                disease_by_name[norm] = entry
        elif kind == "Gene":
            gene_by_id[nid] = entry
            if norm not in gene_by_name:
                gene_by_name[norm] = entry
        elif kind == "Pathway":
            pathway_by_id[nid] = entry
            if norm not in pathway_by_name:
                pathway_by_name[norm] = entry

    ctd = {}
    cbg = {}
    dag = {}
    gppw = {}

    for _, row in edges.iterrows():
        meta = row["metaedge"]
        src = row["source"]
        tgt = row["target"]
        if meta == "CtD":
            ctd.setdefault(src, set()).add(tgt)
        elif meta == "CbG":
            cbg.setdefault(src, set()).add(tgt)
        elif meta == "DaG":
            dag.setdefault(src, set()).add(tgt)
        elif meta == "GpPW":
            gppw.setdefault(src, set()).add(tgt)

    reverse_ctd = {}
    for src, tgts in ctd.items():
        for t in tgts:
            reverse_ctd.setdefault(t, set()).add(src)

    reverse_cbg = {}
    for src, tgts in cbg.items():
        for t in tgts:
            reverse_cbg.setdefault(t, set()).add(src)

    reverse_dag = {}
    for src, tgts in dag.items():
        for t in tgts:
            reverse_dag.setdefault(t, set()).add(src)

    reverse_gppw = {}
    for src, tgts in gppw.items():
        for t in tgts:
            reverse_gppw.setdefault(t, set()).add(src)

    return {
        "drug_by_id": drug_by_id,
        "drug_by_name": drug_by_name,
        "disease_by_id": disease_by_id,
        "disease_by_name": disease_by_name,
        "gene_by_id": gene_by_id,
        "gene_by_name": gene_by_name,
        "pathway_by_id": pathway_by_id,
        "pathway_by_name": pathway_by_name,
        "ctd": ctd,
        "cbg": cbg,
        "dag": dag,
        "gppw": gppw,
        "reverse_ctd": reverse_ctd,
        "reverse_cbg": reverse_cbg,
        "reverse_dag": reverse_dag,
        "reverse_gppw": reverse_gppw,
    }


def find_entity(name, by_name_map):
    norm = normalize_name(name)
    if norm in by_name_map:
        return by_name_map[norm]
    for k, v in by_name_map.items():
        if norm in k or k in norm:
            return v
    return None


def build_pathway_graph(drug_id, disease_id, g, max_genes=6, max_pathways=4):
    nodes = []
    edges = []
    seen = set()

    def add_node(nid, label, ntype):
        if nid not in seen:
            seen.add(nid)
            nodes.append({"id": nid, "type": ntype, "label": label})

    def add_edge(src, tgt, weight, etype):
        edges.append({"source": src, "target": tgt, "weight": round(weight, 2), "type": etype})

    drug_entry = g["drug_by_id"].get(drug_id)
    disease_entry = g["disease_by_id"].get(disease_id)

    if drug_entry:
        add_node(drug_id, drug_entry["name"], "drug")

    if disease_entry:
        add_node(disease_id, disease_entry["name"], "disease")

    if not drug_entry and not disease_entry:
        return nodes, edges

    drug_genes = list(g["cbg"].get(drug_id, set()))[:max_genes] if drug_id else []
    disease_genes = list(g["dag"].get(disease_id, set()))[:max_genes] if disease_id else []

    shared_genes = set(drug_genes) & set(disease_genes)
    all_pathways = set()

    for gid in drug_genes + disease_genes:
        gene_entry = g["gene_by_id"].get(gid)
        if gene_entry:
            add_node(gid, gene_entry["name"], "gene")
        for pw in g["gppw"].get(gid, set()):
            all_pathways.add(pw)

    for pw in list(all_pathways)[:max_pathways]:
        pw_entry = g["pathway_by_id"].get(pw)
        if pw_entry:
            add_node(pw, pw_entry["name"], "pathway")

    for gid in drug_genes:
        if gid in seen and drug_id in seen:
            add_edge(drug_id, gid, 0.85, "binds")

    for gid in disease_genes:
        if gid in seen and disease_id in seen:
            add_edge(gid, disease_id, 0.78, "associates")

    for gid in drug_genes + disease_genes:
        if gid not in seen:
            continue
        for pw in all_pathways:
            if pw in seen:
                add_edge(gid, pw, 0.72, "participates")

    for sg in shared_genes:
        if sg in seen and drug_id in seen and disease_id in seen:
            add_edge(drug_id, sg, 0.92, "binds")
            add_edge(sg, disease_id, 0.88, "associates")

    return nodes, edges


def make_model_sources(confidence):
    direct_graph = round(min(0.40 + confidence * 0.10, 0.50), 2)
    pathway = round(min(0.30 + confidence * 0.08, 0.38), 2)
    network = round(max(1.0 - direct_graph - pathway, 0.12), 2)
    return [
        {"name": "Direct Graph Evidence", "contribution": direct_graph, "description": "Direct Hetionet treatment or association edges"},
        {"name": "Pathway Connectivity", "contribution": pathway, "description": "Shared gene-pathway relationships in Hetionet"},
        {"name": "Network Support", "contribution": network, "description": "Aggregated graph traversal support"},
    ]


def compute_similar_entities(source_id, target_type, candidates_with_evidence, g, top_k):
    for cd in candidates_with_evidence:
        similar = []
        for other in candidates_with_evidence:
            if other["entityName"] == cd["entityName"]:
                continue
            shared_pw = cd.get("_pathways", set()) & other.get("_pathways", set())
            shared_genes = cd.get("_genes", set()) & other.get("_genes", set())
            if not shared_pw and not shared_genes:
                continue
            total_pw = cd.get("_pathways", set()) | other.get("_pathways", set())
            pw_sim = len(shared_pw) / len(total_pw) if total_pw else 0
            total_genes = cd.get("_genes", set()) | other.get("_genes", set())
            gene_sim = len(shared_genes) / len(total_genes) if total_genes else 0
            combined = pw_sim * 0.6 + gene_sim * 0.4
            similar.append({
                "entityName": other["entityName"],
                "similarityScore": round(combined, 3),
                "sharedPathways": sorted(shared_pw),
                "sharedGenes": sorted(shared_genes),
            })
        similar.sort(key=lambda x: x["similarityScore"], reverse=True)
        cd["similarEntities"] = similar[:top_k]
    return candidates_with_evidence


def finalize_candidate(cd):
    if cd.get("direct"):
        cd["confidence"] = 1.0
    elif cd.get("count"):
        cd["confidence"] = round(min(0.3 + cd["count"] * 0.05, 0.95), 3)
    else:
        cd["confidence"] = 0.0
    all_genes = sorted(cd.pop("_genes", set()))
    cd["supportingGenes"] = all_genes[:15]
    pathway_names = cd.pop("_pathways", set())
    cd.pop("count", None)
    pathways = []
    for pw_name in sorted(pathway_names):
        pathways.append({
            "name": pw_name,
            "genes": cd["supportingGenes"],
            "relevanceScore": round(cd["confidence"], 2),
        })
    pathways.sort(key=lambda x: x["relevanceScore"], reverse=True)
    cd["pathways"] = pathways
    if not cd.get("evidence"):
        cd["evidence"] = f"Pathway evidence via {', '.join(p['name'] for p in pathways[:3])}" if pathways else "Hetionet graph connectivity"
    cd["modelSources"] = make_model_sources(cd["confidence"])
    cd.pop("direct", None)
    return cd


def find_diseases_for_drug(drug_name, g, top_k):
    drug = find_entity(drug_name, g["drug_by_name"])
    if not drug:
        return [], None, [], []

    drug_id = drug["id"]
    direct_diseases = g["ctd"].get(drug_id, set())
    drug_genes = g["cbg"].get(drug_id, set())

    candidates = {}

    for did in direct_diseases:
        de = g["disease_by_id"].get(did)
        if de:
            candidates[de["name"]] = {
                "entityName": de["name"],
                "entityType": "disease",
                "confidence": 1.0,
                "evidence": f"Direct CtD edge: {drug['name']} treats {de['name']}",
                "supportingGenes": [],
                "pathways": [],
                "modelSources": [],
                "rank": 0,
                "_genes": set(),
                "_pathways": set(),
                "count": 999,
                "direct": True,
            }

    for gid in drug_genes:
        ge = g["gene_by_id"].get(gid)
        if not ge:
            continue
        gene_name = ge["name"]
        pathways = g["gppw"].get(gid, set())
        for pw in pathways:
            pwe = g["pathway_by_id"].get(pw)
            if not pwe:
                continue
            pw_name = pwe["name"]
            for other_gene in g["reverse_gppw"].get(pw, set()):
                if other_gene == gid:
                    continue
                oge = g["gene_by_id"].get(other_gene)
                if not oge:
                    continue
                other_gene_name = oge["name"]
                for assoc_disease in g["reverse_dag"].get(other_gene, set()):
                    de = g["disease_by_id"].get(assoc_disease)
                    if not de or assoc_disease in direct_diseases:
                        continue
                    key = de["name"]
                    if key not in candidates:
                        candidates[key] = {
                            "entityName": de["name"],
                            "entityType": "disease",
                            "confidence": 0.0,
                            "evidence": "",
                            "supportingGenes": [],
                            "pathways": [],
                            "modelSources": [],
                            "rank": 0,
                            "_genes": set(),
                            "_pathways": set(),
                            "count": 0,
                            "direct": False,
                        }
                    candidates[key]["_genes"].add(gene_name)
                    candidates[key]["_genes"].add(other_gene_name)
                    candidates[key]["_pathways"].add(pw_name)
                    candidates[key]["count"] += 1

    for key, cd in candidates.items():
        if cd.get("count") and not cd.get("direct"):
            cd["evidence"] = f"Predicted via {cd['count']} paths through {', '.join(list(cd['_pathways'])[:5])}"

    temp_list = list(candidates.values())
    temp_list.sort(key=lambda x: x["confidence"], reverse=True)
    top_temp = temp_list[:top_k]
    top_temp = compute_similar_entities(drug_id, "disease", top_temp, g, top_k)
    top_candidates = [finalize_candidate(cd) for cd in top_temp]

    top_disease_id = None
    if top_temp:
        top_disease = find_entity(top_temp[0]["entityName"], g["disease_by_name"])
        top_disease_id = top_disease["id"] if top_disease else None

    nodes, edges = build_pathway_graph(drug_id, top_disease_id, g)

    return top_candidates, drug, nodes, edges


def find_drugs_for_disease(disease_name, g, top_k):
    disease = find_entity(disease_name, g["disease_by_name"])
    if not disease:
        return [], None, [], []

    disease_id = disease["id"]
    direct_drugs = g["reverse_ctd"].get(disease_id, set())
    disease_genes = g["dag"].get(disease_id, set())

    candidates = {}

    for did in direct_drugs:
        de = g["drug_by_id"].get(did)
        if de:
            candidates[de["name"]] = {
                "entityName": de["name"],
                "entityType": "drug",
                "confidence": 1.0,
                "evidence": f"Direct CtD edge: {de['name']} treats {disease['name']}",
                "supportingGenes": [],
                "pathways": [],
                "modelSources": [],
                "rank": 0,
                "_genes": set(),
                "_pathways": set(),
                "count": 999,
                "direct": True,
            }

    for gid in disease_genes:
        ge = g["gene_by_id"].get(gid)
        if not ge:
            continue
        gene_name = ge["name"]
        pathways = g["gppw"].get(gid, set())
        for pw in pathways:
            pwe = g["pathway_by_id"].get(pw)
            if not pwe:
                continue
            pw_name = pwe["name"]
            for other_gene in g["reverse_gppw"].get(pw, set()):
                if other_gene == gid:
                    continue
                oge = g["gene_by_id"].get(other_gene)
                if not oge:
                    continue
                other_gene_name = oge["name"]
                for targeting_drug in g["reverse_cbg"].get(other_gene, set()):
                    de = g["drug_by_id"].get(targeting_drug)
                    if not de or targeting_drug in direct_drugs:
                        continue
                    key = de["name"]
                    if key not in candidates:
                        candidates[key] = {
                            "entityName": de["name"],
                            "entityType": "drug",
                            "confidence": 0.0,
                            "evidence": "",
                            "supportingGenes": [],
                            "pathways": [],
                            "modelSources": [],
                            "rank": 0,
                            "_genes": set(),
                            "_pathways": set(),
                            "count": 0,
                            "direct": False,
                        }
                    candidates[key]["_genes"].add(gene_name)
                    candidates[key]["_genes"].add(other_gene_name)
                    candidates[key]["_pathways"].add(pw_name)
                    candidates[key]["count"] += 1

    for key, cd in candidates.items():
        if cd.get("count") and not cd.get("direct"):
            cd["evidence"] = f"Predicted via {cd['count']} paths through {', '.join(list(cd['_pathways'])[:5])}"

    temp_list = list(candidates.values())
    temp_list.sort(key=lambda x: x["confidence"], reverse=True)
    top_temp = temp_list[:top_k]
    top_temp = compute_similar_entities(disease_id, "drug", top_temp, g, top_k)
    top_candidates = [finalize_candidate(cd) for cd in top_temp]

    top_drug_id = None
    if top_temp:
        top_drug = find_entity(top_temp[0]["entityName"], g["drug_by_name"])
        top_drug_id = top_drug["id"] if top_drug else None

    nodes, edges = build_pathway_graph(top_drug_id, disease_id, g)

    return top_candidates, disease, nodes, edges


def find_similar_diseases_for_pair(drug_id, disease_id, connecting_pathway_names, g, top_k):
    drug_genes = g["cbg"].get(drug_id, set())
    scored = {}

    for gid in drug_genes:
        pathways = g["gppw"].get(gid, set())
        for pw in pathways:
            pwe = g["pathway_by_id"].get(pw)
            if not pwe or pwe["name"] not in connecting_pathway_names:
                continue
            for other_gene in g["reverse_gppw"].get(pw, set()):
                if other_gene == gid:
                    continue
                for assoc_disease in g["reverse_dag"].get(other_gene, set()):
                    if assoc_disease == disease_id:
                        continue
                    de = g["disease_by_id"].get(assoc_disease)
                    if not de:
                        continue
                    key = de["name"]
                    if key not in scored:
                        scored[key] = {
                            "entityName": key,
                            "similarityScore": 0.0,
                            "sharedPathways": set(),
                            "sharedGenes": set(),
                            "count": 0,
                        }
                    scored[key]["sharedPathways"].add(pwe["name"])
                    g1 = g["gene_by_id"].get(gid)
                    if g1:
                        scored[key]["sharedGenes"].add(g1["name"])
                    scored[key]["count"] += 1

    for data in scored.values():
        shared = len(data["sharedPathways"] & set(connecting_pathway_names))
        total = len(set(connecting_pathway_names))
        data["similarityScore"] = round(shared / total if total > 0 else 0, 3)
        data["sharedPathways"] = sorted(data["sharedPathways"])
        data["sharedGenes"] = sorted(data["sharedGenes"])

    sorted_similar = sorted(scored.values(), key=lambda x: x["similarityScore"], reverse=True)
    return sorted_similar[:top_k]


def find_pair_prediction(drug_name, disease_name, g, top_k, threshold):
    drug = find_entity(drug_name, g["drug_by_name"])
    disease = find_entity(disease_name, g["disease_by_name"])

    drug_id = drug["id"] if drug else None
    disease_id = disease["id"] if disease else None

    if not drug_id or not disease_id:
        empty_pred = {
            "drugName": drug_name or disease_name,
            "confidence": 0.0,
            "supportingGenes": [],
            "modelSources": [],
            "explanation": f"Entity not found in Hetionet",
            "pathways": [],
            "rank": 1,
            "similarEntities": [],
        }
        return {
            "id": prediction_id(),
            "predictions": [empty_pred],
            "topPrediction": empty_pred,
            "modelEnsembleScore": 0.0,
        }, drug or disease, [], []

    direct = disease_id in g["ctd"].get(drug_id, set())
    drug_genes = g["cbg"].get(drug_id, set())
    disease_genes = g["dag"].get(disease_id, set())

    connecting_genes = set()
    connecting_pathways = {}

    for gid in drug_genes:
        ge = g["gene_by_id"].get(gid)
        if not ge:
            continue
        gene_name = ge["name"]
        pathways = g["gppw"].get(gid, set())
        for pw in pathways:
            pwe = g["pathway_by_id"].get(pw)
            if not pwe:
                continue
            pw_name = pwe["name"]
            for other_gene in g["reverse_gppw"].get(pw, set()):
                if other_gene == gid:
                    continue
                oge = g["gene_by_id"].get(other_gene)
                if not oge:
                    continue
                if other_gene in disease_genes:
                    connecting_genes.add(gene_name)
                    connecting_genes.add(oge["name"])
                    if pw_name not in connecting_pathways:
                        connecting_pathways[pw_name] = {"genes": set(), "count": 0}
                    connecting_pathways[pw_name]["genes"].add(gene_name)
                    connecting_pathways[pw_name]["genes"].add(oge["name"])
                    connecting_pathways[pw_name]["count"] += 1

    path_count = sum(pw["count"] for pw in connecting_pathways.values())
    confidence = 1.0 if direct else round(min(0.3 + path_count * 0.05, 0.95), 3)

    evidence_parts = []
    if direct:
        evidence_parts.append("Direct CtD edge")
    if connecting_genes:
        evidence_parts.append(f"{len(connecting_genes)} shared genes")
    if connecting_pathways:
        evidence_parts.append(f"{len(connecting_pathways)} shared pathways")
    explanation = f"{drug['name']} \u2192 {disease['name']}: {' + '.join(evidence_parts)}" if evidence_parts else f"No direct Hetionet path found between {drug['name']} and {disease['name']}"

    pathways_info = []
    for pw_name, pw_data in connecting_pathways.items():
        pathways_info.append({
            "name": pw_name,
            "genes": sorted(pw_data["genes"]),
            "relevanceScore": round(min(pw_data["count"] / max(path_count, 1), 1.0), 2),
        })
    pathways_info.sort(key=lambda x: x["relevanceScore"], reverse=True)

    connecting_pathway_names = set(connecting_pathways.keys())
    similar_diseases = find_similar_diseases_for_pair(drug_id, disease_id, connecting_pathway_names, g, top_k)

    pred = {
        "drugName": drug["name"],
        "confidence": round(confidence, 3),
        "supportingGenes": sorted(connecting_genes),
        "modelSources": make_model_sources(confidence),
        "explanation": explanation,
        "pathways": pathways_info,
        "rank": 1,
        "similarEntities": similar_diseases,
    }

    nodes, edges = build_pathway_graph(drug_id, disease_id, g)

    return {
        "id": prediction_id(),
        "predictions": [pred],
        "topPrediction": pred,
        "modelEnsembleScore": round(confidence, 3),
    }, drug, nodes, edges


def main():
    raw = sys.stdin.read()
    try:
        body = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {e}"}))
        return

    drug_name = body.get("drugName", "").strip()
    disease_name = body.get("diseaseName", "").strip()
    threshold = body.get("confidenceThreshold", 0.5)
    top_k = min(int(body.get("topK", 5)), 50)

    if not drug_name and not disease_name:
        print(json.dumps({"error": "Provide at least drugName or diseaseName"}))
        return

    try:
        g = get_graph()

        mode = "both"
        if drug_name and disease_name:
            mode = "both"
        elif drug_name and not disease_name:
            mode = "drug_to_disease"
        elif not drug_name and disease_name:
            mode = "disease_to_drug"

        t_trav = time.time()
        if mode == "drug_to_disease":
            results, entity, graph_nodes, graph_edges = find_diseases_for_drug(drug_name, g, top_k)
            for r in results:
                if r.get("entityType") != "disease":
                    raise ValueError(
                        f"ENTITY-TYPE GUARD FAILED: drug_to_disease mode returned entityType='{r.get('entityType')}' "
                        f"for entity '{r.get('entityName')}'. Expected 'disease'. "
                        f"This indicates the query layer regressed to returning non-disease entities."
                    )
            predictions = []
            for i, r in enumerate(results):
                pred = {
                    "drugName": r["entityName"],
                    "confidence": r["confidence"],
                    "supportingGenes": r.get("supportingGenes", []),
                    "modelSources": r.get("modelSources", []),
                    "explanation": r.get("evidence", r.get("explanation", "")),
                    "pathways": r.get("pathways", []),
                    "rank": i + 1,
                }
                if "similarEntities" in r:
                    pred["similarEntities"] = r["similarEntities"]
                predictions.append(pred)
            result = {
                "id": prediction_id(),
                "mode": mode,
                "sourceEntity": {"name": entity["name"], "type": "drug"} if entity else {"name": drug_name, "type": "drug"},
                "predictions": predictions,
                "modelEnsembleScore": results[0]["confidence"] if results else 0,
            }
            if not results:
                result["predictions"] = [{"drugName": drug_name, "confidence": 0, "supportingGenes": [], "modelSources": [], "explanation": f"No Hetionet data for '{drug_name}'", "pathways": [], "rank": 1, "similarEntities": []}]
            result["topPrediction"] = result["predictions"][0]

        elif mode == "disease_to_drug":
            results, entity, graph_nodes, graph_edges = find_drugs_for_disease(disease_name, g, top_k)
            for r in results:
                if r.get("entityType") != "drug":
                    raise ValueError(
                        f"ENTITY-TYPE GUARD FAILED: disease_to_drug mode returned entityType='{r.get('entityType')}' "
                        f"for entity '{r.get('entityName')}'. Expected 'drug'. "
                        f"This indicates the query layer regressed to returning non-drug entities."
                    )
            predictions = []
            for i, r in enumerate(results):
                pred = {
                    "drugName": r["entityName"],
                    "confidence": r["confidence"],
                    "supportingGenes": r.get("supportingGenes", []),
                    "modelSources": r.get("modelSources", []),
                    "explanation": r.get("evidence", r.get("explanation", "")),
                    "pathways": r.get("pathways", []),
                    "rank": i + 1,
                }
                if "similarEntities" in r:
                    pred["similarEntities"] = r["similarEntities"]
                predictions.append(pred)
            result = {
                "id": prediction_id(),
                "mode": mode,
                "sourceEntity": {"name": entity["name"], "type": "disease"} if entity else {"name": disease_name, "type": "disease"},
                "predictions": predictions,
                "modelEnsembleScore": results[0]["confidence"] if results else 0,
            }
            if not results:
                result["predictions"] = [{"drugName": disease_name, "confidence": 0, "supportingGenes": [], "modelSources": [], "explanation": f"No Hetionet data for '{disease_name}'", "pathways": [], "rank": 1, "similarEntities": []}]
            result["topPrediction"] = result["predictions"][0]

        else:
            pair_result, drug, graph_nodes, graph_edges = find_pair_prediction(drug_name, disease_name, g, top_k, threshold)
            result = pair_result
            result["mode"] = "both"
            result["sourceEntity"] = {"name": drug_name, "type": "drug"} if drug_name else {"name": disease_name, "type": "disease"}

        log(f"Graph traversal ({mode}): {time.time() - t_trav:.2f}s for {len(result.get('predictions', []))} results")

        result["input"] = {
            "drugName": drug_name,
            "diseaseName": disease_name,
            "confidenceThreshold": threshold,
            "topK": top_k,
            "mode": mode,
        }
        result["timestamp"] = timestamp_now()
        result["graphNodes"] = graph_nodes
        result["graphEdges"] = graph_edges

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Pipeline error: {e}"}))
        return


if __name__ == "__main__":
    main()
