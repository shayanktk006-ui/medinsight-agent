# 🩺 MedInsight Agent

An AI-powered medical report explainer — upload a report, ask a question by **voice or text**, and get a warm, easy-to-understand answer read back to you, in **English or Urdu**.

---

## ✨ Features

- 📄 **Upload any PDF medical report** — drag & drop or click to select
- 🎙️ **Ask by voice** — speak your question instead of typing
- 🔊 **Listen to the answer** — text-to-speech reads the explanation aloud
- 🌐 **Bilingual support** — automatically replies in English or Urdu, matching your question's language
- 🧠 **Smart guardrails** — detects if the file isn't actually a medical report, or if your question isn't answerable from it, instead of guessing
- ⚡ **Fast & lightweight** — no heavy frontend framework, quick to load and run

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI Model | Google Gemini API |
| PDF Parsing | PyPDF2 |
| Frontend | HTML, CSS, JavaScript |
| Voice | Web Speech API (Recognition + Synthesis) |
| Deployment | Docker + Render |

---

## 🚀 How It Works

1. 📤 Upload a PDF medical report
2. ❓ Ask a question — type it or tap the mic
3. 🤖 Gemini reads the report and answers in plain, friendly language
4. 🔊 Tap "Listen" to hear the answer spoken aloud

---

## ⚙️ Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/shayanktk006-ui/medinsight-agent.git
cd medinsight-agent

# 2. Install dependencies
pip install -r requirements.txt

# 3. Add your Gemini API key
# Create a .env file in the root folder with:
# GEMINI_API_KEY=your_key_here

# 4. Run the app
uvicorn main:app --reload
```

Then open `http://127.0.0.1:8000` in your browser. 🎉

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (never committed — kept in `.env` locally or as a secret on your hosting platform) |

---

## 📌 Notes

- 🔐 This app does not store or share uploaded reports — files are processed in-memory per request.
- ⚕️ This tool is for general understanding only and is not a substitute for professional medical advice.

---

## 👤 Author

**Muhammad Shayan Khurshid**
Built as part of an AI Agent development project.
