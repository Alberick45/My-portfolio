# Albert's Interactive Portfolio & Admin CMS

A modern, full-stack, highly interactive developer portfolio built with **React, TypeScript, Vite, Tailwind CSS, and FastAPI / Vercel Serverless Functions**. Features an interactive terminal console, interactive project showcase, live blog CMS, roadmap tracker, and headless GitHub API data persistence.

---

## 🛠️ Data Storage & Tech Stack

### Data Storage Architecture (Dual Strategy)

Your data (blog posts, roadmap goals, uploaded media, and user preferences) is stored using a **hybrid headless CMS setup**:

| Data Type | Production (Vercel Cloud) | Local Development (FastAPI) |
| :--- | :--- | :--- |
| **Blog Posts** | `public/posts.json` via **GitHub REST API** (committing directly to your repository) | `backend/posts.json` (Local JSON file via FastAPI) |
| **Roadmap Goals** | `public/roadmap.json` via **GitHub REST API** | `backend/roadmap.json` (Local JSON file via FastAPI) |
| **Image Uploads** | Base64 committed to GitHub `public/images/` via Serverless API | Saved to local `public/images/` directory |
| **Video Uploads** | **Cloudinary CDN** (`cloudinary.uploader.upload_large`) | **Cloudinary CDN** (with local fallback to `public/images/`) |
| **Client Session & Preferences** | `localStorage` (Admin state, theme, terminal logs) | `localStorage` |

### Core Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **Local Backend**: FastAPI (Python 3), Uvicorn, Pydantic, Cloudinary Python SDK
- **Production Serverless API**: Vercel Serverless Functions (Node.js API routes under `/api`)
- **Storage & Hosting**: GitHub API (Git as a Headless CMS), Cloudinary (Media CDN), Vercel (Hosting)

---

## ✨ Features

- **Interactive Terminal Console**: Built-in CLI supporting commands like `help`, `about`, `skills`, `projects`, `contact`, `clear`, and `sudo admin`.
- **Blog CMS & Admin Modal**: Password-protected Admin modal allowing creation, editing, deletion, and image/video uploads for blog articles.
- **Dynamic Roadmap & Goals**: Visual milestone & roadmap tracker manageable directly through the application interface.
- **Projects Showcase**: Visual grid showcasing projects with live demos, code repository links, tech tags, and detailed article modal popups.
- **Cloud Media Uploads**: Integrated image and video upload support powered by Cloudinary and GitHub API.
- **Responsive & Dark UI**: Sleek, glassmorphic dark mode UI built with custom CSS utilities and Tailwind.

---

## 📁 Repository Structure

```text
My-portfolio/
├── api/                    # Vercel Serverless API functions (Production backend)
│   ├── posts.js            # Commits post updates to GitHub public/posts.json
│   ├── roadmap.js          # Commits roadmap updates to GitHub public/roadmap.json
│   ├── upload.js           # Uploads images directly to GitHub public/images/
│   └── sign-cloudinary.js  # Signs upload requests for Cloudinary CDN
├── backend/                # Python FastAPI server (Local development backend)
│   ├── main.py             # FastAPI app endpoints for posts, roadmap & uploads
│   ├── posts.json          # Local post data file
│   ├── roadmap.json        # Local roadmap data file
│   └── requirements.txt    # Python dependencies
├── public/                 # Static assets & production JSON database
│   ├── images/             # Uploaded images directory
│   ├── posts.json          # Live production blog posts
│   └── roadmap.json        # Live production roadmap items
├── src/                    # React frontend application
│   ├── components/         # UI Components (Hero, About, Projects, Blog, Goals, Terminal, etc.)
│   ├── App.tsx             # Main App root component
│   └── main.tsx            # React entrypoint
├── package.json            # NPM dependencies & scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ and `npm`
- **Python**: v3.9+ (if running the local FastAPI backend)

### 1. Installation

Clone the repository and install frontend dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Production Serverless / GitHub CMS Config
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=Alberick45/My-portfolio

# Cloudinary Config (for video uploads & media CDN)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🏃 Running the Application

### Option A: Local Frontend + Python FastAPI Backend

Run both the Vite dev server and the Python FastAPI backend:

1. **Start the React dev server**:
   ```bash
   npm run dev
   ```
2. **Start the FastAPI backend server**:
   ```bash
   npm run backend
   ```
   *The backend runs at `http://localhost:8000`.*

### Option B: Local Frontend standalone (Vercel CLI / Mock mode)

If deploying or testing with Vercel serverless functions locally:

```bash
npx vercel dev
```

---

## 📜 Available NPM Scripts

- `npm run dev`: Starts Vite frontend development server (`http://localhost:5173`).
- `npm run backend`: Starts Python FastAPI backend using Uvicorn (`http://localhost:8000`).
- `npm run build`: Compiles TypeScript and builds the production bundle into `/dist`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.

---

## 🔐 Admin Access

To access the Admin panel for writing articles or updating roadmap items:
1. Open the Terminal console at the bottom of the page.
2. Type `sudo admin` or click the **Admin Login** button in the Blog/Goals section.
3. Authenticate to unlock writing, editing, and upload tools.

---

## 📝 License

This project is open-source under the MIT License.
