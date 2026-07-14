import streamlit as st
from data_loader import load_data, build_drug_disease_map

st.set_page_config(page_title="Drug Repurposing System", layout="wide")
st.title("🔬 AI Driven Drug Repurpose")

@st.cache_resource
def get_data():
    nodes, edges = load_data()
    return build_drug_disease_map(nodes, edges)

drugs, diseases = get_data()

# --- تعريف الدوال (ضروري جداً) ---
def get_drugs(search=""):
    q = search.lower().strip()
    results = [d for d in drugs if q in d["name"].lower()] if q else drugs
    return {"drugs": results, "total": len(results)}

def get_diseases(search=""):
    q = search.lower().strip()
    results = [d for d in diseases if q in d["name"].lower()] if q else diseases
    return {"diseases": results, "total": len(results)}

def get_drug(drug_id):
    for d in drugs:
        if d["id"] == drug_id:
            return {"drug": d}
    return {"error": "Drug not found"}

def get_stats():
    return {
        "total_drugs": len(drugs),
        "total_diseases": len(diseases),
        "total_treatments": sum(len(d["diseases"]) for d in drugs),
    }
# ---------------------------------

st.title("Drug Repurpose API - Streamlit Interface")

tab1, tab2, tab3, tab4 = st.tabs(["/api/drugs", "/api/diseases", "/api/drug/{id}", "/api/stats"])

with tab1:
    search_input = st.text_input("Search drugs by name:", key="drug_input")
    data = get_drugs(search_input)
    st.json(data)

with tab2:
    search_input = st.text_input("Search diseases by name:", key="disease_input")
    data = get_diseases(search_input)
    st.json(data)

with tab3:
    drug_id = st.text_input("Enter Drug ID:")
    if drug_id:
        data = get_drug(drug_id)
        st.json(data)

with tab4:
    if st.button("Get Stats"):
        data = get_stats()
        st.json(data)