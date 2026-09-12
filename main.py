from fastapi import FastAPI, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from google import genai
import PyPDF2
import io
import os

load_dotenv()

app = FastAPI()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += (page.extract_text() or "")
            text += "\n"
        return text.strip()
    except Exception:
        return ""


@app.post("/explain")
async def explain_report(
    file: UploadFile,
    question: str = Form(...)
):
    try:
        pdf_bytes = await file.read()
    except Exception:
        return {"answer": "I couldn't read that file 😕 Please try uploading it again."}

    report_text = extract_text_from_pdf(pdf_bytes)

    if not report_text:
        return {
            "answer": "I couldn't pull any text out of this file 📄 It might be "
                       "a scanned image PDF or a corrupted file. Could you try "
                       "another report PDF?"
        }

    prompt = f"""
You are a warm, caring doctor explaining a medical report to a non-expert.

Rules:
1. First check if the "Report" text below actually looks like a medical
   report (lab results, diagnosis, prescription, vitals, etc). If it does
   NOT look medical at all, politely say this doesn't look like a medical
   report and you can't explain it as one — do not guess. You may add one
   gentle, simple emoji (like 😕 or 📄) if it fits naturally.
2. If it IS a medical report, but the "Question" is unrelated to the
   content of the report, say clearly that the report doesn't contain
   information to answer that question — do not make things up.
3. Detect the language the Question is written in (English or Urdu/Roman
   Urdu) and reply in that SAME language.
4. Be warm and reassuring if values are normal (a small friendly emoji like
   😊 or 💚 is welcome here); gently suggest seeing a doctor if there is a
   concern (keep this part calm and caring, not alarming). Don't overdo
   emojis — at most one per answer, and only where it feels natural.
5. No markdown formatting (no asterisks, no bold). Plain sentences only.
6. Keep the answer under 50 words — be concise.

Report:
{report_text}

Question:
{question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={"max_output_tokens": 150}
        )
        answer = response.text or "I couldn't generate an answer just now 😕 Please try again."
    except Exception:
        answer = "Something went wrong on my end 😕 Please try again in a moment."

    return {"answer": answer}


app.mount(
    "/",
    StaticFiles(directory="static", html=True),
    name="static"
)