from typing import List, Optional
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = "ok"
    app: str = "STARK AI"
    version: str = "1.0.0"
    mode: str = Field(description="Local Demo Mode or AWS Bedrock / Textract Connected")
    aws_connected: bool
    bedrock_model: Optional[str] = None

class RedFlag(BaseModel):
    indicator: str
    evidence: str
    severity: str = Field(description="CRITICAL, HIGH, MEDIUM, LOW")

class AnalyzeTextRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="The suspicious message, SMS, or WhatsApp text")

class ThreatAnalysisResult(BaseModel):
    verdict: str = Field(description="CRITICAL DANGER, HIGH RISK, SUSPICIOUS / CAUTION, or LOW RISK / SAFE")
    risk_score: int = Field(ge=0, le=100, description="Risk level percentage (0-100)")
    scam_category: str = Field(description="e.g. Fake UPI Refund, Electricity Disconnection, Fake Bank KYC, Telegram Task Job, Investment Fraud")
    summary: str
    red_flags: List[RedFlag]
    recommended_actions: List[str]
    defanged_urls: List[str]
    critical_warning: Optional[str] = None
    disclaimer: str = "STARK AI provides AI-assisted awareness guidance. Verify independently before taking action."
    engine_used: str

class SimulatorOption(BaseModel):
    id: str
    text: str

class SimulatorScenario(BaseModel):
    id: int
    category: str
    title: str
    situation: str
    sender: str
    options: List[SimulatorOption]

class SimulatorVerifyRequest(BaseModel):
    scenario_id: int
    selected_option_id: str

class SimulatorVerifyResponse(BaseModel):
    is_safe: bool
    verdict: str
    explanation: str
    safety_principle: str
    scam_breakdown: str
    next_scenario_id: Optional[int] = None
