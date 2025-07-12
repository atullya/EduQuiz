from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile

from MCQGENERATOR import generate_mcqs_from_text, read_pdf_text

app = FastAPI()

# Allow requests from frontend or anywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate_from_text(
    text: str = Form(...), number_of_questions: int = Form(5)
):
    try:
        mcqs = generate_mcqs_from_text(text, desired_mcq_count=number_of_questions)
        return JSONResponse(content={"success": True, "mcqs": mcqs})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)}, status_code=500
        )

@app.post("/generate-pdf")
async def generate_from_pdf(
    pdf_file: UploadFile = File(...), number_of_questions: int = Form(5)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await pdf_file.read())
            tmp_path = tmp.name

        text = read_pdf_text(tmp_path)
        mcqs = generate_mcqs_from_text(text, desired_mcq_count=number_of_questions)

        os.remove(tmp_path)

        return JSONResponse(content={"success": True, "mcqs": mcqs})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)}, status_code=500
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
