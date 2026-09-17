export interface RedFlag {
  indicator: string;
  evidence: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ThreatAnalysisResult {
  verdict: string;
  risk_score: number;
  scam_category: string;
  summary: string;
  red_flags: RedFlag[];
  recommended_actions: string[];
  defanged_urls: string[];
  critical_warning?: string;
  disclaimer: string;
  engine_used: string;
}

export interface ImageAnalysisResponse {
  qr_detected: boolean;
  decoded_content: string | null;
  bounding_box: number[][][] | null;
  analysis: ThreatAnalysisResult;
}

export interface SimulatorOption {
  id: string;
  text: string;
}

export interface SimulatorScenario {
  id: number;
  category: string;
  title: string;
  situation: string;
  sender: string;
  options: SimulatorOption[];
}

export interface SimulatorVerifyResponse {
  is_safe: boolean;
  verdict: string;
  explanation: string;
  safety_principle: string;
  scam_breakdown: string;
  next_scenario_id: number | null;
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  mode: string;
  aws_connected: boolean;
  bedrock_model: string | null;
}
