## 🧬 AI-Driven Drug Repurposing & XAI Framework (Drug Therapeutic use with geometric deep learning and human centered design)

An integrated, production-ready computational system designed for automated drug repurposing on the Hetionet v1.0 knowledge graph. This repository combines vectorized graph representations, dual-model link prediction pipelines, Explainable AI (XAI) attribution, a high-performance FastAPI backend, and a modern React/Vite user interface.
This project focuses on AI-driven drug repurposing using Graph Neural Networks (GNNs). The system is designed to model complex biological entities as graphs and predict new drug-disease associations by analyzing network-based relationships, which can be used in a wide range of applications such as precision medicine and identifying new uses for existing medications
The main tasks of the project are:   
1-Preprocessing biological datasets and knowledge graphs like PrimeKG.  
2-Representing drugs and diseases as nodes within a biological graph.  
3-Implementing and training GNN architecture (such as TxGNN) for link prediction.  
4-Evaluating model performance using metrics like AUROC and AUPRC.  
5-Predicting high-probability drug candidates for specific diseases. 

---

### 📂 Repository Structure & Architecture

```text
AI-DRIVEN-DRUG-REPURPOSE/
├── .devcontainer/                  # Unified development environment configurations (Docker / VS Code)
├── data/                           # Data directory structure (Excluded from Git)
│   ├── raw/                        # Original Hetionet knowledge graph TSV files
│   └── processed/                  # Processed CSR matrices, node embeddings, and cache objects
├── src/                            # 🧠 Core AI Engine & Machine Learning Source Code
│   ├── __init__.py
│   ├── data_loader.py              # Loads Hetionet files and constructs sparse matrices
│   ├── graph_engine.py             # Builds sparse graphs and structural graph operations
│   ├── model_1.py                  # Model 1: Vectorized DREAMwalk & graph embeddings
│   ├── model_2.py                  # Model 2: Link prediction & indication classification
│   ├── pipeline.py                 # End-to-end model pipeline integration and data flow
│   ├── xai.py                      # Explainable AI logic (SHAP & feature attribution layers)
│   └── utils.py                    # Mathematical helper utilities and matrix formatters
├── backend/                        # 🌐 FastAPI REST API Service
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entry point, routing, and CORS policy
│   ├── schemas.py                  # Pydantic data validation models for request/response payloads
│   └── routes/                     # Modular API endpoints
│       ├── predict_routes.py       # Endpoints handling prediction pipelines and XAI inferences
│       └── data_routes.py          # Endpoints providing compound (drug) and disease catalogues
├── frontend/                       # 🎨 Modern Web Application Interface (React + Vite + Tailwind CSS)
│   ├── src/                        # Component layouts, pages, and API service integration
│   ├── public/                     # Browser static assets and icons
│   ├── package.json                # Node.js project dependencies and scripts
│   ├── vite.config.ts              # Vite development server configuration
│   └── tailwind.config.ts          # Styling and design system configuration
├── notebooks/                      # 📓 Research & Exploratory Analysis
│   ├── 01_data_exploration.ipynb   # Structural data discovery of the Hetionet network graph
│   ├── 02_model_experiments.ipynb  # Experimental training iterations and hyperparameter tuning
│   └── Drug_repurpose_XAI.ipynb    # Primary research notebook for generating evaluation plots
├── papers/                         # 📄 Academic Documentation & Manuscripts
│   ├── figures/                    # Visual architecture and experimental figures (Fig. 1, Fig. 2)
│   └── main_paper.tex              # IEEE LaTeX formatted manuscript draft for conference submission
├── .gitignore                      # Git exclusion rules (data/, node_modules/, cache, .env)
├── requirements.txt                # Python backend package dependencies
└── README.md                       # Project documentation and developer setup instructions


### 🔄 System Architecture & Data Flow

```text
[ React Frontend ] 
       │  (HTTP / JSON Requests)
       ▼
[ FastAPI Backend ] (backend/main.py)
       │  (Calls Core Functions)
       ▼
[ AI Pipeline ] (src/pipeline.py) ◄─── (src/model_1.py + src/model_2.py + src/xai.py)
       │  (Reads Processed Matrices)
       ▼
[ Hetionet Data ] (data/processed/)

     |||||||||

## 🔬 Hetionet Sub-Network Architecture

Hetionet integrates millions of biomedical concepts across multiple biological scales. Our core sub-network specifically isolates and targets paths connecting **Compounds** to **Diseases** through intermediary **Genes (Proteins)** and supporting metadata nodes.

### 1. Essential Node Types (`node_type`)
* **Compound**: Pharmaceutical drugs using DrugBank identifiers (e.g., `DB00338`).
* **Disease**: Pathological conditions using Disease Ontology identifiers (e.g., `DOID:8398`).
* **Gene**: Proteins and genetic targets using Entrez Gene identifiers (e.g., `Gene::5`).
* **Anatomy**: Human organs and tissues using UBERON ontology IDs (e.g., `UBERON:0002048`).
* **Pathway**: Biological pathways using Pathway Commons IDs (e.g., `PC7_1124`).
* **Side Effect**: Adverse drug reactions using UMLS CUI IDs (e.g., `C0027497`).
* **Symptom**: Clinical manifestations using MeSH identifiers (e.g., `Mesh:D003967`).
* **Pharmacologic Class**: Mechanism of action classes using NDF-RT IDs (e.g., `N0000175574`).
* **Biological Process**: Broad cellular objectives using Gene Ontology IDs (e.g., `GO:0006915`).
* **Molecular Function**: Specific biochemical tasks using Gene Ontology IDs (e.g., `GO:0004672`).
* **Cellular Component**: Subcellular localization targets using Gene Ontology IDs (e.g., `GO:0005737`).

### 2. Core Edge Types (`relation`)
* **CtD (Compound–treats–Disease)**: ⚠️ **Primary Target (Goldmine)** representing therapeutic indications.
* **CbG (Compound–binds–Gene)**: Physical binding interactions between drugs and protein targets.
* **DaG (Disease–associates–Gene)**: Known genetic associations linked to specific pathologies.
* **GPPw / GpBP / GpMF / GpCC**: Functional mappings connecting genes to pathways, biological processes, molecular functions, and cellular compartments.
* **GcG / GgG**: Protein-protein interaction (PPI) networks.
* **Supplementary Edges**: Includes palliative effects (`CpD`), adverse events (`CseSE`), expression regulations (`CuG`, `CdG`, `DuG`, `DdG`), anatomical localizations (`DbA`), and entity resemblances (`DrD`, `CrC`).

---

## ⚙️ Performance & Optimization
* Replaces standard NetworkX dictionary lookups with highly efficient **SciPy** and **NumPy** Compressed Sparse Row (CSR) array operations.
* Leak-free validation and training splits designed for massive heterogeneous graph structures.
* Integrated **SHAP** explainability layer to interpret link prediction confidence scores for novel drug candidates.

---

## 📦 Requirements

To install all necessary dependencies for vector operations, graph modeling, and model explanation, use the provided `requirements.txt`:

```bash
pip install -r requirements.txt
