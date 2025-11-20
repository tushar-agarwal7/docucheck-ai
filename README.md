# DocuCheck AI 🤖📄

AI-powered document compliance checker that validates PDF documents against custom rules using advanced language models.

![DocuCheck AI](/public/landing.png)
![DocuCheck AI](/public/report.png)
## Features ✨

- **PDF Upload**: Drag-and-drop or click to upload PDF documents (2-10 pages, max 10MB)
- **Custom Rules**: Define 3 compliance rules to check your document against
- **Multi-Model Support**: Choose from multiple AI models (Gemini 2.5,GPT 4.1 , Claude 3.5)
- **Detailed Analysis**: Get pass/fail status, evidence, reasoning, and confidence scores for each rule
- **Professional UI**: Dark theme with smooth animations and responsive design
- **Real-time Processing**: Fast document analysis with loading states

## Tech Stack 🛠️

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: pdf-parse
- **AI Integration**: OpenRouter API (multi-model support)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites 📋

- Node.js 18+ installed
- OpenRouter API key (get it free at https://openrouter.ai/)

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/docucheck-ai.git
   cd docucheck-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Usage 📖

1. **Upload a PDF**: Click the upload area or drag and drop a PDF file (2-10 pages, max 10MB)

2. **Define Rules**: Enter 3 compliance rules you want to check. Examples:
   - "The document must have a purpose section"
   - "The document must mention at least one date"
   - "The document must define at least one term"

3. **Select AI Model**: Choose from available models (free models recommended for testing)

4. **Check Document**: Click the "Check Document" button

5. **View Results**: See pass/fail status, evidence from the document, AI reasoning, and confidence scores

## Project Structure 📁

```
docucheck-ai/
├── app/
│   ├── page.tsx                    # Main UI page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── api/
│       └── check-document/
│           └── route.ts            # API endpoint
│
├── components/
│   ├── UploadSection.tsx           # PDF upload component
│   ├── RulesInput.tsx              # Rules input fields
│   ├── ResultsTable.tsx            # Results display
│   └── ModelSelector.tsx           # AI model selector
│
├── lib/
│   ├── pdf-extractor.ts            # PDF text extraction
│   ├── llm-checker.ts              # LLM API integration
│   └── types.ts                    # TypeScript types
│
└── README.md
```

## API Endpoint 🔌

### POST `/api/check-document`

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `pdf`: PDF file
  - `rules`: JSON array of 3 rule strings
  - `model`: Selected model ID

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "rule": "Document must mention a date",
      "status": "pass",
      "evidence": "Found in page 1: 'Published 2024'",
      "reasoning": "Document includes a publication year.",
      "confidence": 92
    }
  ],
  "model": "google/gemini-flash-2.5"
}
```

## Available AI Models 🤖

| Model | Provider | Cost | Speed | Accuracy |
|-------|----------|------|-------|----------|
| Gemini Flash 2.5 | Google | Free | Fast | High |
| GPT 4.1 | Meta | Free | Fast | Good |
| Claude 3.5 Sonnet | Anthropic | Paid | Medium | Very High |

## Environment Variables 🔐

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for OpenRouter referrer) | No |

## Deployment 🌐

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Development 💻

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by Tushar**