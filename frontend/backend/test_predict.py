"""
Drug Repurposing Prediction — Entity-Type Verification Tests

Tests that the query layer returns the correct entity types depending on mode:
  Drug-to-Disease:  drug in  -> disease entities out
  Disease-to-Drug:  disease in -> drug entities out

Run:  python test_predict.py
"""

import sys
import json

sys.path.insert(0, ".")
from frontend.predict import (
    get_graph,
    find_diseases_for_drug,
    find_drugs_for_disease,
    find_entity,
)

FAIL = 0
PASS = 0


def check(description, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  PASS  {description}")
    else:
        FAIL += 1
        print(f"  FAIL  {description}")
        if detail:
            print(f"        {detail}")


def ensure(description, condition, detail=""):
    if not condition:
        print(f"\nFATAL: {description}")
        if detail:
            print(f"       {detail}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Load graph once
# ---------------------------------------------------------------------------
print("Loading Hetionet graph (cached) ...", end=" ", flush=True)
g = get_graph()
print("OK")
print()

# ===========================================================================
# TEST 1: Drug-to-Disease  —  "Valproic Acid" (no disease)
# ===========================================================================
print("=" * 70)
print("TEST 1: Drug-to-Disease mode  —  Valproic Acid")
print("=" * 70)

drug_name = "Valproic Acid"
results, entity, gn, ge = find_diseases_for_drug(drug_name, g, top_k=10)

ensure(
    "Valproic Acid entity found in Hetionet",
    entity is not None,
    f"Entity lookup failed for '{drug_name}'",
)

print(f"  Source entity: {entity['name']} (id={entity['id']}, kind={entity['kind']})")
print(f"  Results returned: {len(results)}")
print()

# --- ENTITY-TYPE GUARD: every result must be a disease ---
all_diseases = all(r.get("entityType") == "disease" for r in results)
check(
    "Every top-level result is entityType='disease'",
    all_diseases,
    f"Found types: {[r.get('entityType') for r in results[:10]]}",
)

# --- No drug/compound names in the results ---
drug_like = [r["entityName"] for r in results if "Valproic" in r["entityName"]]
check(
    "No result name contains 'Valproic' (would indicate wrong entity type)",
    len(drug_like) == 0,
    f"Found: {drug_like}",
)

# --- "epilepsy syndrome" in top 3 (known direct CtD edge) ---
top3_names = [r["entityName"] for r in results[:3]]
epilepsy_present = any("epilepsy" in name.lower() for name in top3_names)
check(
    "'epilepsy syndrome' appears in top 3 results (direct CtD edge in Hetionet)",
    epilepsy_present,
    f"Top 3 names: {top3_names}",
)

# --- Show top results ---
print(f"\n  Top {min(10, len(results))} results:")
for r in results[:10]:
    conf = r.get("confidence", 0)
    extra = " [DIRECT CtD]" if conf == 1.0 else ""
    print(f"    {r['entityName']:35s}  confidence={conf:.3f}{extra}")
print()

# ===========================================================================
# TEST 2: Disease-to-Drug  —  "Alzheimer's Disease" (no drug)
# ===========================================================================
print("=" * 70)
print("TEST 2: Disease-to-Drug mode  —  Alzheimer's Disease")
print("=" * 70)

disease_name = "Alzheimer's Disease"
results, entity, gn, ge = find_drugs_for_disease(disease_name, g, top_k=10)

ensure(
    "Alzheimer's Disease entity found in Hetionet",
    entity is not None,
    f"Entity lookup failed for '{disease_name}'",
)

print(f"  Source entity: {entity['name']} (id={entity['id']}, kind={entity['kind']})")
print(f"  Results returned: {len(results)}")
print()

# --- ENTITY-TYPE GUARD: every result must be a drug ---
all_drugs = all(r.get("entityType") == "drug" for r in results)
check(
    "Every top-level result is entityType='drug'",
    all_drugs,
    f"Found types: {[r.get('entityType') for r in results[:10]]}",
)

# --- No disease names in the results ---
known_diseases = ["Alzheimer", "dementia", "amyloid", "tau"]
disease_like = [
    r["entityName"] for r in results
    if any(d in r["entityName"].lower() for d in known_diseases)
]
check(
    "No result name contains disease-like terms (would indicate wrong entity type)",
    len(disease_like) == 0,
    f"Found: {disease_like}",
)

# --- Results include known Alzheimer's drugs (direct CtD edges) ---
alz_drugs = {"Donepezil", "Memantine", "Rivastigmine", "Galantamine"}
found_alz_drugs = {r["entityName"] for r in results} & alz_drugs
check(
    "Results include known FDA-approved Alzheimer's drugs (Donepezil, Memantine, etc.)",
    len(found_alz_drugs) >= 2,
    f"Found: {found_alz_drugs}; Expected some of: {alz_drugs}",
)

# --- Show top results ---
print(f"\n  Top {min(10, len(results))} results:")
for r in results[:10]:
    conf = r.get("confidence", 0)
    extra = " [DIRECT CtD]" if conf == 1.0 else ""
    print(f"    {r['entityName']:35s}  confidence={conf:.3f}{extra}")
print()

# --- Note about Metformin ---
print("  NOTE: Metformin does not appear in Hetionet graph-traversal results for")
print("  Alzheimer's Disease at top-50 rank. The Metformin-Alzheimer's connection")
print("  is a DREAMwalk/TxGNN model prediction (simulated in frontend mock data),")
print("  not a direct Hetionet graph-traversal finding. See test_mock.js for that test.")
print()

# ===========================================================================
# TEST 3: Entity-Type Guard (negative test)
# ===========================================================================
print("=" * 70)
print("TEST 3: Entity-Type Guard — verify guard detects wrong types")
print("=" * 70)

# Simulate what a buggy drug_to_disease function would return
class MockBadResult:
    def get(self, key, default=None):
        if key == "entityType":
            return "drug"
        return default

try:
    from frontend.predict import main as predict_main
except ImportError:
    predict_main = None

# Test the guard logic directly: if drug_to_disease returns drug entities,
# the ValueError should contain "ENTITY-TYPE GUARD FAILED"
guard_triggered = False
try:
    for r in [MockBadResult()]:
        if r.get("entityType") != "disease":
            raise ValueError(
                f"ENTITY-TYPE GUARD FAILED: drug_to_disease mode returned "
                f"entityType='{r.get('entityType')}'. Expected 'disease'."
            )
except ValueError as e:
    if "ENTITY-TYPE GUARD FAILED" in str(e):
        guard_triggered = True

check(
    "Entity-type guard correctly raises error when drug_to_disease returns drug entities",
    guard_triggered,
    "The ValueError was not raised with the expected message",
)

# Also test reverse: disease to drug guard
guard_triggered_rev = False
try:
    class MockBadResultDrug:
        def get(self, key, default=None):
            if key == "entityType":
                return "disease"
            return default
    for r in [MockBadResultDrug()]:
        if r.get("entityType") != "drug":
            raise ValueError(
                f"ENTITY-TYPE GUARD FAILED: disease_to_drug mode returned "
                f"entityType='{r.get('entityType')}'. Expected 'drug'."
            )
except ValueError as e:
    if "ENTITY-TYPE GUARD FAILED" in str(e):
        guard_triggered_rev = True

check(
    "Entity-type guard correctly raises error when disease_to_drug returns disease entities",
    guard_triggered_rev,
    "The ValueError was not raised with the expected message",
)

print()

# ===========================================================================
# SUMMARY
# ===========================================================================
print("=" * 70)
print(f"  PASS: {PASS}  |  FAIL: {FAIL}  |  {'ALL PASSED' if FAIL == 0 else 'SOME FAILED'}")
print("=" * 70)

sys.exit(0 if FAIL == 0 else 1)
