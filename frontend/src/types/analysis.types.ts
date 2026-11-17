export type PredictionLabel = 'CHINH_XAC' | 'GAY_HIEU_LAM' | 'SAI_SU_THAT' | 'CHUA_DU_THONG_TIN';

export type ModalityType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'MULTIMODAL';

export interface ModalityScore {
  modality: ModalityType;
  predicted_label: PredictionLabel;
  confidence_score: number;
  contribution_weight: number;
}

export interface FactCheckEvidence {
  source_name: string;
  source_domain: string;
  source_url: string;
  snippet: string;
  similarity_score: number;
  nli_verdict: 'SUPPORTS' | 'REFUTES' | 'NOT_ENOUGH_INFO';
}

export interface XaiAttribution {
  text_tokens?: { token: string; weight: number }[];
  image_heatmap_url?: string;
  modality_weights?: { modality: string; weight: number }[];
  reasoning_summary?: string;
}

export interface PropagationMetrics {
  total_nodes: number;
  total_edges: number;
  cascade_depth: number;
  virality_speed: number;
  structural_virality: number;
  community_count: number;
  is_simulated: boolean;
}

export interface AnalysisSessionSummary {
  id: number;
  title: string;
  primary_modality: ModalityType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  overall_prediction?: PredictionLabel;
  confidence_score?: number;
  inconsistency_score?: number;
  created_at: string;
}
