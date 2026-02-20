---

# 🧠 Company Internal Chatbot (RAG-Based Knowledge Assistant)

A full-stack **Retrieval-Augmented Generation (RAG)** powered internal company assistant built using **Next.js, TypeScript, Pinecone, Gemini (Embeddings), and Groq (LLM)**.

This project simulates how enterprise internal AI assistants are built to provide accurate, grounded responses based strictly on company documentation.

---

## 🚀 Project Overview

This system enables employees to query internal company documents using natural language while ensuring:

* ✅ Grounded responses (no hallucinated answers)
* ✅ Secure, admin-controlled document management
* ✅ Vector-based semantic retrieval
* ✅ Production-style AI architecture

Unlike traditional chatbots, this system does **not rely solely on LLM memory**. Instead, it retrieves relevant document chunks from a vector database and uses them as context for answer generation.

---

# 🏗️ Architecture

## 🔹 Stage 1 — Document Indexing (Admin-Only Process)

```text
PDF Document
   ↓
LangChain PDFLoader
   ↓
Text Chunking (500 tokens, 100 overlap)
   ↓
Gemini Embedding (3072-dimension vectors)
   ↓
Pinecone (Dense Vector Storage)
```

* Indexing is a **one-time process per document**
* Re-run only if:

  * A new document is added
  * Document content changes
  * Embedding model changes
  * Index is reset

---

## 🔹 Stage 2 — Query Flow (RAG Pipeline)

```text
User Question
   ↓
Generate Embedding (Gemini)
   ↓
Pinecone Similarity Search (Top K = 3)
   ↓
Retrieve Relevant Chunks
   ↓
Groq LLM (Llama 3.1 8B)
   ↓
Grounded Answer
```

The LLM is strictly instructed to:

> Answer only using retrieved context. If not found, refuse.

This reduces hallucinations and ensures enterprise reliability.

---

# 🛠️ Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js API Routes
* TypeScript

## AI & Vector Stack

* **Gemini API** → Embeddings (`gemini-embedding-001`)
* **Pinecone** → Vector Database (Dense, 3072 dimension)
* **Groq API** → LLM (Llama 3.1 8B Instant)
* **LangChain** → Text Chunking (RecursiveCharacterTextSplitter)

---

# 📂 Project Structure

```
app/
 ├── page.tsx              → Chat UI
 └── api/
      └── llmchat/route.ts → RAG API

scripts/
 ├── prepare.ts            → Document indexing script
 ├── embedding.ts          → Gemini embedding logic
 └── vectorStore.ts        → Pinecone operations

data/documents/
 └── nexus.pdf             → Company knowledge base
```

---

# 🔒 Document Management & Security

This system is designed for **internal company usage**.

### 🚫 End users cannot upload documents.

* Knowledge base updates are admin-controlled
* Indexing is a manual process
* Prevents unauthorized document injection
* Ensures data integrity

---

## 📌 Adding a New Document

1️⃣ Place the new file inside:

```
data/documents/
```

2️⃣ Run the indexing script manually:

```bash
npx tsx scripts/prepare.ts
```

This script will:

* Load the document
* Chunk the content
* Generate embeddings (Gemini)
* Store vectors in Pinecone

⚠️ The chatbot will only retrieve data from documents that have already been indexed.

---

# 🔌 API Design

## POST `/api/llmchat`

### Request

```json
{
  "question": "What is the leave policy?"
}
```

### Internal Flow

1. Create embedding for question
2. Query Pinecone for top 3 similar vectors
3. Build contextual prompt
4. Send to Groq LLM
5. Return response

### Response

```json
{
  "reply": "The company provides 18 paid leaves per year..."
}
```

---

# 🔐 Environment Variables

Create `.env.local`:

```
GEMINI_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key
GROQ_API_KEY=your_groq_key
```

Next.js automatically loads environment variables (no dotenv required).

---

# ▶️ Running the Project

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 🧪 Example Queries

* What is the leave policy?
* Who is the backend team lead?
* What are working hours?
* How to bake a cake? → (Correctly refused)

---

# ⚙️ Key Challenges Faced

### 1️⃣ Gemini SDK Version Conflicts

* v1 vs v1beta API confusion
* Model naming inconsistencies
* Embedding vs generation endpoint mismatch

**Resolution:**
Used Gemini strictly for embeddings and switched to Groq for generation.

---

### 2️⃣ Pinecone Vector Shape Errors

* Incorrect embedding return format
* Upsert schema mismatch
* Namespace query structure errors

**Resolution:**
Ensured embedding returns `number[]` (3072 dimensions) and validated before query.

---

### 3️⃣ Dependency Conflicts

* dotenv peer dependency conflicts
* LangChain + Stagehand dependency mismatch

**Resolution:**
Removed unnecessary dotenv usage (Next.js handles env internally).

---

### 4️⃣ RAG Debugging Complexity

* Incorrect JSON destructuring in API route
* Passing object instead of string to embedding function
* SDK response shape misunderstandings

**Resolution:**
Strict TypeScript typing + structured debugging.

---

# 🧠 What This Project Demonstrates

* Real-world RAG system architecture
* Vector database integration
* Embedding lifecycle management
* Controlled document ingestion
* Prompt engineering for hallucination reduction
* Production-style debugging
* Dependency conflict resolution

This mirrors how enterprise internal AI assistants are built.

---

# 🚀 Future Improvements

* Streaming LLM responses
* Conversational memory
* Admin-only document upload panel
* Role-based access control (RBAC)
* Citation references in answers
* Multi-document indexing
* Hybrid search (keyword + vector)

---

# 🏆 Why This Matters

This is not just a chatbot.

It demonstrates:

* Understanding of AI system architecture
* End-to-end RAG pipeline implementation
* Secure internal knowledge management
* Production-aware design decisions

---

## 👨‍💻 Author

Built as a practical implementation of enterprise-grade Retrieval-Augmented Generation architecture.

---
