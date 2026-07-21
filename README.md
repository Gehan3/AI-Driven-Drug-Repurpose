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

## 🔄🔬 Hetionet Sub-Network Architecture

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


## 📊 Hetionet Data Processing Pipeline
$$\text{Compound} \xrightarrow{\text{CbG}} \text{Gene} \xrightarrow{\text{GrPW}} \text{Pathway} \xrightarrow{\text{GrPW}^{-1}} \text{Gene} \xrightarrow{\text{DaG}} \text{Disease}$$
This section handles loading, processing, and optimizing the Hetionet dataset through four main stages:

### 1. ✅ Data Loading
* Imports essential libraries such as `os` and `pandas`.
* Defines file paths for:
  * **Nodes dataset (TSV format):** Contains biological entities like genes, diseases, and pathways.
  * **Edges dataset (compressed `.gz` format):** Represents relationships between entities.
* Loads both datasets into `pandas DataFrames` using:
  * `read_csv()` with tab separation (`sep="\t"`) for TSV files.
  * Automatic decompression using `compression="gzip"` for edge data.

### 2. ✅ Data Format Conversion (Optimization)
* Converts datasets into **Parquet format** (a columnar storage format optimized for high speed and efficient storage compared to CSV or TSV).
* Uses the `fastparquet` engine for writing:
  * `nodes_df.to_parquet()` for nodes data.
  * `edges_df.to_parquet()` for edges data.
* Significantly enhances future read/write operations.

### 3. ✅ Exploratory Data Analysis (EDA)
Performs basic data exploration to understand structure and relationships:
* Identifies unique values:
  * Node types using `nodes_df['kind'].unique()`
  * Relationship types using `edges_df['metaedge'].unique()`
* Displays sample data:
  * First 5 rows of nodes and edges using `.head()`
  * Filtered examples such as:
    * Nodes where `kind == 'Pathway'`
    * Edges where `metaedge == 'CrC'`

### 4. ✅ Error Handling
Includes robust error handling mechanisms:
* `FileNotFoundError`: Triggered when input files are missing or paths are incorrect.
* `Generic Exception`: Captures any unexpected runtime errors.

## 💡 Why Device Configuration Documentation Matters

Yes, including this section in your documentation is extremely valuable for several key reasons:

### 1. Transparency & Reproducibility
* Clearly documents the hardware requirements and environment specs needed to run or replicate your code.
* Lets anyone reviewing your repository know whether the pipeline was designed for local CPU execution or heavy GPU acceleration.

### 2. Troubleshooting & Environment Verification
* Helps users or collaborators instantly diagnose hardware issues if a script fails (e.g., catching missing CUDA drivers or PyTorch installation mismatches).

### 3. Professional Code Standards
* High-end machine learning and data science repositories always specify device initialization to handle multi-GPU or CPU-only fallback scenarios gracefully.


## 🚀 DREAMwalk: Optimized, Leak-Free, & GPU-Accelerated Pipeline

This module implements a fully optimized, high-performance variant of the DREAMwalk framework designed for robust drug-disease link prediction.

---

### 🔄 Architecture Overview

The pipeline transitions from slow, iterative graph traversal to vectorized matrix operations:

```mermaid
graph TD
    A[Raw Hetionet Sub-Network] --> B[SciPy / CuPy CSR Sparse Matrix]
    B --> C{Cross-Validation Split}
    C -->|Strict Isolation| D[In-Fold Jaccard Similarities]
    C -->|Zero Leakage| E[Test CtD Edges Removed]
    D --> F[Vectorized Random Walks]
    E --> F
    F --> G[Gensim Word2Vec Embeddings]
    G --> H[Full Compound × Disease Matrix]
    H --> I[Batched XGBoost Inference]

## ⚙️ DREAMwalk: Configuration Setup

This section defines the global configuration parameters for the DREAMwalk pipeline, ensuring reproducibility, consistency, and centralized control over all model and training hyperparameters.

---

### 1. 🚶 Random Walk Parameters
These control how graph random walks explore the network:
* `walk_length = 100` → Number of steps per walk.
* `num_walks = 10` → Number of walks generated per node.
* `teleport_prob = 0.5` → Probability of random teleportation (enhances network exploration).
* `p = 1.0, q = 1.0` → Neutral Node2Vec-style parameters ensuring unbiased random walk behavior.

### 2. 🔤 Embedding Learning (Word2Vec)
These parameters define how node embeddings are learned from the generated random walks:
* `embed_dim = 128` → Dimensionality of the embedding vectors.
* `window = 5` → Context window size for co-occurrence.
* `min_count = 1` → Includes all nodes regardless of frequency.
* `sg = 1` → Skip-Gram model architecture.
* `workers = 4` → Parallel CPU threads for training.
* `epochs = 5` → Number of training iterations.

### 3. 🔀 Cross-Validation Setup
* `n_folds = 10` → Uses Stratified K-Fold cross-validation for robust model evaluation.

### 4. 🚀 XGBoost Model Parameters
These control the final supervised link prediction stage:
* `n_estimators = 300` → Number of boosting rounds.
* `max_depth = 6` → Tree complexity control.
* `learning_rate = 0.05` → Step size shrinkage to prevent overfitting.
* `subsample = 0.8` → Row sampling ratio per tree.
* `colsample_bytree = 0.8` → Feature sampling ratio per tree.
* `eval_metric = "logloss"` → Optimization objective.
* `random_state = 42` → Ensures deterministic results and reproducibility.
* `n_jobs = -1` → Utilizes all available CPU cores.
* `tree_method = "hist"` → Optimized histogram-based training algorithm.
* `device = "cuda"` → Enables fast GPU acceleration if available.

### 5. 🗂️ System-Level Settings
* `random_seed = 42` → Ensures full reproducibility across runs.
* `cache_dir = "./dreamwalk_cache"` → Dedicated directory for storing intermediate results (e.g., embeddings, graphs, and matrices).

### 6. 🔒 Reproducibility Control
To guarantee consistent and stable outputs across different environments:
```python
random.seed(CONFIG["random_seed"])
np.random.seed(CONFIG["random_seed"])


## 📂 Data Loading Pipeline (`load_hetionet_local`)

This section documents the modular data loading function designed to ingest, filter, and prepare the Hetionet dataset for downstream machine learning workflows.

---

### 1. 🧩 Function Definition
* **`def load_hetionet_local():`**
  * Defines a reusable and modular function.
  * Encapsulates all dataset loading logic into a single, clean entry point.
  * Improves overall code organization, readability, and maintainability.

### 2. ⚡ Loading Preprocessed Data (Parquet Format)
The function loads two core preprocessed datasets:
* **`nodes_df = pd.read_parquet("...nodes.parquet")`** → Contains biological entities (genes, diseases, compounds, and pathways).
* **`edges_df = pd.read_parquet("...edges.parquet")`** → Contains relationships between entities in the heterogeneous graph.
* **Why Parquet?**
  * Significantly faster I/O performance compared to CSV or TSV formats.
  * Reduced disk storage size.
  * Highly optimized for heavy analytical workloads.

### 3. 🎯 Filtering Biological Interactions (CtD)
```python
treats_df = edges_df[edges_df['metaedge'] == 'CtD'].copy()


## 🕸️ `SparseGraph`: Advanced High-Performance Graph Architecture

```mermaid
graph TD
    A[Raw Data / Pandas DataFrames] -->|build_graph| B[SparseGraph Initialization]
    B --> C[Node IDs & id2idx Mapping]
    B --> D[CSR Adjacency Matrix]
    D --> E[Bidirectional Edge Construction]
    E --> F[Padded Neighbor Precomputation]
    F --> G[Vectorized Random Walk Ready]
    
    H[Cross-Validation Split] -->|remove_edges| I[CSR to COO Conversion]
    I --> J[Bidirectional Removal Set]
    J --> K[Boolean Mask Filtering]
    K --> L[New Isolated G_train SparseGraph]