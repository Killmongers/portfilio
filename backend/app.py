from fastapi import FastAPI,HTTPException
from fastapi.responses import StreamingResponse


app = FastAPI()

@app.get("/download-pdf")
def stream_pdf():
    try:
        pdf_path = "file.pdf"  # e.g., "static/mydoc.pdf"
        file = open(pdf_path, mode="rb")
        return StreamingResponse(file, media_type="application/pdf", headers={
            "Content-Disposition": 'attachment; filename="file.pdf"'
            })
    except FIleNotFoundError:
        raise HTTPException(status_code=404 ,details="PDF file not Found")
