from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from src.orchestrator import Orchestrator
from fastapi.responses import FileResponse
from src.report_annotator import annotate_pdf


import shutil
import os



app = FastAPI(title="SiteSentry API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# orchestrator

orchestrator = Orchestrator()

@app.get("/")
def health_check():
    return {"status": "SiteSentry API is running"}

@app.post("/analyze")
async def analyze_report(
    file: UploadFile = File(...),
    project_type: str = Form(default="residential"),
    city_tier: str = Form(default="tier_2")
):
    # Save uploaded file
    upload_path = f"uploads/{file.filename}"
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run pipeline
    result = orchestrator.process(upload_path, project_type, city_tier)

    # Cleanup uploaded file
    os.remove(upload_path)

    return result



@app.post("/analyze-and-annotate")
async def analyze_and_annotate(
    file: UploadFile = File(...),
    project_type: str = Form(default="residential"),
    city_tier: str = Form(default="tier_2")
):
    # Save upload
    upload_path = f"uploads/{file.filename}"
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run pipeline
    result = orchestrator.process(upload_path, project_type, city_tier)

    # Annotate PDF
    output_path = f"outputs/annotated_{file.filename}"
    os.makedirs("outputs", exist_ok=True)
    annotate_pdf(upload_path, output_path, result["agents"])

    # Cleanup upload
    os.remove(upload_path)

    result["annotated_filename"] = file.filename
    return result

@app.get("/download/{filename}")
def download_annotated(filename: str):
    path = f"outputs/annotated_{filename}"
    return FileResponse(path, media_type="application/pdf", filename=f"SiteSentry_{filename}")
