export type PredictionMode = "both" | "drug_to_disease" | "disease_to_drug"

export interface PredictionInput {
  drugName: string
  diseaseName: string
  confidenceThreshold: number
  topK: number
  mode?: PredictionMode
}

export interface SourceEntity {
  name: string
  type: "drug" | "disease"
}

export interface GeneContribution {
  gene: string
  importance: number
  description: string
}

export interface PathwayInfo {
  name: string
  genes: string[]
  relevanceScore: number
}

export interface ModelSource {
  name: string
  contribution: number
  description: string
}

export interface SimilarEntity {
  entityName: string
  similarityScore: number
  sharedPathways: string[]
  sharedGenes: string[]
}

export interface DrugPrediction {
  drugName: string
  confidence: number
  supportingGenes: string[]
  modelSources: ModelSource[]
  explanation: string
  pathways: PathwayInfo[]
  rank: number
  similarEntities?: SimilarEntity[]
}

export interface GraphNode {
  id: string
  type: "drug" | "disease" | "gene" | "pathway"
  label: string
}

export interface GraphEdge {
  source: string
  target: string
  weight: number
  type: string
}

export interface PredictionResult {
  id: string
  input: PredictionInput
  predictions: DrugPrediction[]
  topPrediction: DrugPrediction
  modelEnsembleScore: number
  processingTime: string
  timestamp: string
  mode: PredictionMode
  sourceEntity?: SourceEntity
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  _simulated?: boolean
}

export interface DrugInfo {
  id: string
  name: string
  synonyms: string[]
  description: string
  mechanismOfAction: string
  targets: string[]
  sideEffects: string[]
  clinicalTrials: number
  drugBankId: string
}

export interface DiseaseInfo {
  id: string
  name: string
  description: string
  associatedGenes: string[]
  prevalence: string
  omimId: string
  pathways: string[]
}

export interface ModelExplanation {
  drugName: string
  diseaseName: string
  confidenceBreakdown: {
    dreamwalk: number
    xgboost: number
    txgnn: number
    ensemble: number
  }
  reasoningPath: {
    step: number
    description: string
    evidence: string[]
  }[]
  networkEvidence: {
    nodeType: string
    nodeName: string
    relationshipStrength: number
  }[]
  relatedGenes: {
    gene: string
    role: string
    associationScore: number
  }[]
  biologicalPathways: {
    name: string
    description: string
    involvedGenes: string[]
  }[]
  modelContributions: {
    model: string
    weight: number
    rationale: string
  }[]
}

export interface PipelineStep {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

export interface ArchitectureSection {
  id: string
  title: string
  subtitle: string
  description: string
  benefits: string[]
  scientificRelevance: string
  details: {
    label: string
    value: string
  }[]
  color: string
}

export interface ChartDataPoint {
  name: string
  value: number
  fill?: string
}

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}
