from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from app.config import settings
from app.models import (
    HealthResponse,
    AnalyzeTextRequest,
    ThreatAnalysisResult,
    SimulatorScenario,
    SimulatorVerifyRequest,
    SimulatorVerifyResponse
)
from app.services.analyzer import analyze_threat
from app.services.qr_scanner import analyze_image_file
from app.services.simulator import get_all_scenarios, verify_scenario_response

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Smart Threat Analysis & Risk Knowledge API"
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    mode = "AWS Bedrock / Textract Connected" if settings.has_aws_credentials else "Local Demo Mode"
    return HealthResponse(
        status="ok",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        mode=mode,
        aws_connected=settings.has_aws_credentials,
        bedrock_model=settings.BEDROCK_MODEL_ID if settings.has_aws_credentials else None
    )

@app.post("/api/analyze/text", response_model=ThreatAnalysisResult)
async def analyze_text_endpoint(req: AnalyzeTextRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return analyze_threat(req.message)

@app.post("/api/analyze/image")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Read file bytes safely (limit to 15MB)
    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image exceeds 15MB limit")
    
    result = analyze_image_file(contents, file.filename)
    return result

@app.get("/api/simulator", response_model=List[SimulatorScenario])
async def get_simulator_scenarios():
    return get_all_scenarios()

@app.post("/api/simulator/verify", response_model=SimulatorVerifyResponse)
async def verify_scenario(req: SimulatorVerifyRequest):
    try:
        return verify_scenario_response(req.scenario_id, req.selected_option_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
