from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

# Allow your frontend origin
origins = [
    "https://portfilio-2.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/download-pdf")
def download_pdf():
    try:
        file = open("file.pdf", "rb")
        return StreamingResponse(file, media_type="application/pdf", headers={
            "Content-Disposition": 'inline; filename="My_CV.pdf"'
        })
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF file not found")

