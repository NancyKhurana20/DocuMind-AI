# 📄 DocuMind AI — Document Question Answering Assistant

DocuMind AI is a frontend web application that allows users to upload documents and ask questions about their content using Google's Gemini AI. The application extracts text from PDF, DOCX, and TXT files directly in the browser and generates answers based only on the uploaded document.

---

## ✨ Features

- Upload **PDF, DOCX, and TXT** documents.
- Extract text directly in the browser using **PDF.js** and **Mammoth.js**.
- Ask questions about the uploaded document using **Gemini AI**.
- AI answers only from the uploaded document.
- Beautiful chat interface with typing animation.
- Supports Markdown formatting in AI responses.
- New Chat option to start a fresh conversation.
- Suggestion pills for quick questions.
- File validation and user-friendly error messages.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure of the application |
| CSS3 | Styling and responsive UI |
| JavaScript (ES6) | Application logic |
| PDF.js | Extract text from PDF files |
| Mammoth.js | Extract text from DOCX files |
| Gemini API | AI-powered document question answering |
| Marked.js | Render formatted AI responses |

---

## 📂 Supported File Types

- PDF (.pdf)
- Microsoft Word (.docx)
- Text File (.txt)

**Maximum file size:** 20 MB

---

## 🚀 How It Works

1. Upload a supported document.
2. The application extracts text from the document.
3. The extracted text is stored temporarily in the browser.
4. Your question and the extracted text are sent to Gemini AI.
5. Gemini generates an answer using only the uploaded document.

---

## 🧪 Validations Implemented

- ✅ Unsupported file type detection.
- ✅ Maximum file size validation (20 MB).
- ✅ Empty document detection.
- ✅ PDF/DOCX/TXT extraction error handling.
- ✅ API error handling for Gemini.
- ✅ Prevent duplicate message requests while AI is responding.

---

## 📸 Application Preview

Add screenshots of the application here.

Recommended screenshots:

- Home Screen
- Document Upload
- Chat Interface
- AI Response
- Error Message

---

## 📁 Project Structure

```text
DocuMind-AI/
│── index.html
│── style.css
│── script.js
│── config.js
│── README.md