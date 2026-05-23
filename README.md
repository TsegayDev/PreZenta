# 🌟 PreZenta - AI-Powered Presentation Deck Builder

PreZenta is a premium, state-of-the-art AI-powered interactive presentation deck builder and editor. Developed to revolutionize how presentations are structured, styled, and exported, PreZenta empowers creators to generate comprehensive, visually stunning, and highly professional slide decks in seconds using artificial intelligence.

Built on top of **Next.js 15**, **Google Genkit**, and **Gemini 2.5 Flash**, PreZenta marries modern AI outlining agents with a rich, interactive, real-time slide canvas editor. Whether you need minimal bullet points, concise copy, or detailed extensive slide decks, PreZenta adapts seamlessly to your preferences and integrates beautiful stock imagery via Pexels.

---

## ✨ Key Features

- **🤖 AI Slide Outline & Deck Generator**: Harnesses the power of Google Genkit and Gemini to dynamically build detailed presentation outlines with slides customized down to the topic, slide count, and preferred text-density.
- **🎨 Interactive Presentation Canvas & Editor**: A fully reactive workspace allowing real-time edits, size customization (16:9, 4:3, or custom), zoom capabilities, layout selectors, and template variations.
- **🖼️ Smart Image Integration**: Integrates premium stock photos directly onto slides using the Pexels API matching the presentation topic.
- **📊 Layout Engine**: Dynamic slide layouts ranging from title pages, split text-and-image grids, statistics counters, timeline milestones, and list views.
- **🚀 Presentation Mode (Full-Screen)**: Deliver your deck with buttery-smooth animations and premium desktop slide transitions using Framer Motion.
- **📥 Power Export Options**:
  - **PPTX Generation**: Download fully editable, native PowerPoint slides using the PPTXGenJS API.
  - **PDF Export**: Save your slide deck instantly as a high-fidelity PDF document.
- **🔐 Premium Authentication**: Mock-integrated Firebase authentication showing user profiles, subscription plans (Free/Pro/Unlimited), and token tracking metrics.
- **🌓 Dynamic Dark/Light Theme**: Sleek glassmorphic sidebars and dark/light modes built on Tailwind CSS.

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js 15](https://nextjs.org/) (React 19, TypeScript)
- **AI Stack**: [Google Genkit](https://github.com/google/genkit) & `@genkit-ai/googleai`
- **LLM Engine**: Gemini 2.5 Flash
- **Styling & UI Components**: Tailwind CSS, Radix UI Primitives, `shadcn/ui`, Framer Motion, Lucide Icons
- **Integrations**: Pexels Developer API (Image curation), Firebase App Hosting config (`apphosting.yaml`)
- **Export Engines**: [pptxgenjs](https://github.com/gitbrent/PptxGenJS), HTML-to-Image

---

## 📂 Project Structure

```bash
PreZenta/
├── PythonPPT/               # Python presentation helpers and designs
│   ├── designer.py          # PowerPoint canvas and layout layout styles
│   └── presentation_data.json
├── src/
│   ├── ai/                  # AI prompts and Genkit configuration flows
│   │   ├── flows/           # Outline generation & enhancement flows
│   │   ├── dev.ts           # Genkit dev playground configurations
│   │   └── genkit.ts        # Genkit instance initialization
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Global root layouts
│   │   ├── globals.css      # Core Tailwind CSS variables & styling
│   │   └── page.tsx         # PreZenta primary workspace application
│   ├── components/          # Reusable React components
│   │   ├── chat/            # Conversational interface for AI agent
│   │   ├── slide/           # Slide editors, strips, selectors, presentation view
│   │   ├── ui/              # Base shadcn component library
│   │   └── ...              # Outlines, loaders, sidebars, theme buttons
│   ├── hooks/               # Custom React state hooks (Auth, Slides, Zoom, History)
│   └── lib/                 # Core helper scripts, PPTX templates, and types
├── .env.example             # Template for API keys
├── apphosting.yaml          # Firebase App Hosting configuration
├── tailwind.config.ts       # Tailored color system & typography theme
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))
- A **Pexels API Key** (Get one from [Pexels Developer Portal](https://www.pexels.com/api/))

### 🔧 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/TsegayDev/PreZenta.git
   cd PreZenta
   ```

2. **Install Project Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file and create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert your API credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PEXELS_API_KEY=your_pexels_api_key_here
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Your app will be live at [http://localhost:9002](http://localhost:9002).

5. **Start Genkit Developer UI** (Optional):
   To explore and test the AI outlines and Genkit flow interfaces visually:
   ```bash
   npm run genkit:dev
   ```

---

## 🏗️ Building for Production

To build the static optimized application bundle for production deployment:
```bash
npm run build
```
To run the production build locally:
```bash
npm run start
```

PreZenta is fully configured with an `apphosting.yaml` file to run on **Firebase App Hosting**, taking care of server-side rendering and dynamic routing seamlessly.

---

## 👨‍💻 Author & Contact Information

Developed and maintained by **Tsegay Gebrekidan**. If you have any inquiries, suggestions, or want to collaborate, feel free to reach out through any of the channels below!

- **👤 Author**: Tsegay Gebrekidan
- **🐙 GitHub**: [@TsegayDev](https://github.com/TsegayDev)
- **📧 Email**: [tsegaydev@gmail.com](mailto:tsegaydev@gmail.com)
- **📞 Phone**: [+251946351205](tel:+251946351205)

---

*Made with ❤️ by Tsegay Gebrekidan. Let's create beautiful presentations together!*
