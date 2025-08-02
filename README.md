<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />

Gossip Spot 🎯

Basic Details

Team Name: COMMA

Team Members

Team Lead: Leon T Punnoose - MBCCET Kuttikkanam

Member 2: Joel John - MBCCET Kuttikkanam

🎨 Project Description

GossipSpot is a fun, Kerala-themed AI web app that detects gossip-worthy zones in hall or event images. Users can upload top-view photos, and the app identifies cozy corners, dining areas, and scenic spots using AI-powered analysis. Designed with a dark, aunty-culture-inspired UI, it blends tech with local flair for a playful social tool.

💡 The Problem (that doesn't exist)

In every event or college function, we all somehow magically know where the gossip happens — behind the snack table, by the water cooler, near the corner chairs. But what if AI could actually prove it? What if we could map the unspoken social energy of a hall? That’s the “problem” GossipSpot solves — by turning whispers into zones.

🧥 The Solution (that nobody asked for)

Introducing GossipSpot — the AI-powered snitch for your social scene. Just upload an image of your event hall, and we’ll highlight exactly where the chitchat, snack raids, and selfie sessions are most likely to explode. It’s high-tech meets high-drama — because why guess where the gossip brews when AI can tell you?

🪜 Hardware Requirements

Main Components

Development Laptop or Local Server (for backend and frontend hosting)

Web Browser (for accessing the React frontend)

Optional: GPU-enabled machine (for faster image analysis using YOLOv8)

Specifications

CPU: Intel i5 or higher (Quad-core recommended)

RAM: Minimum 8 GB (16 GB preferred for AI tasks)

Storage: At least 4 GB free (for models, images, and dependencies)

GPU (Optional): NVIDIA CUDA-enabled GPU

Tools Required

VS Code or any modern code editor

Git & GitHub (for source control and collaboration)

Python ≥ 3.8 (for backend with Flask or FastAPI)

Node.js ≥ 18 (for React + Tailwind frontend)

Vercel CLI (for frontend deployment)

pip / conda for Python packages

npm / yarn for JavaScript dependencies

🚀 Implementation

For Software:

Installation

# 1. Clone the Repository
git clone https://github.com/leontp2810/uselessgossipproject.git
cd uselessgossipproject

# 2. Setup Backend (Python - Flask/FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Start Backend
uvicorn main:app --reload  # For FastAPI
# or
flask run  # If using Flask

# 4. Setup Frontend (React + Tailwind)
cd ../frontend
npm install

# 5. Run Frontend Locally
npm run dev

Deploying to Vercel (Frontend)

# Initialize Vercel
vercel login
vercel

📚 Project Documentation

Directory Structure

gossipspot/
|
├── frontend/                # React + Tailwind frontend
│   ├── public/              # Static assets
│   ├── src/                 
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Home.jsx, Analyze.jsx
│   │   └── App.jsx          # Main app entry
│   ├── tailwind.config.js   # Tailwind config
│   └── vite.config.js       # Vite configuration
│
├── backend/                 # FastAPI backend
│   ├── main.py              # API routes and image analysis
│   ├── image_analysis.py    # AI logic (OpenCV / YOLO)
│   └── requirements.txt     # Python dependencies
│
├── README.md                # Documentation
└── .gitignore               # Files to ignore in version control

📊 Technical Details

Technologies/Components Used

Languages:

TypeScript

JavaScript

HTML

CSS

Frameworks:

Next.js 15

React 19

Tailwind CSS 4.1.9

Libraries & Tools:

UI:

Radix UI

Shadcn/UI

Lucide React

CVA (Class Variance Authority)

Styling & Animation:

Tailwind Merge

CLSX

tw-animate-css

Functionality:

React Hook Form

Zod

Sonner

Development:

TypeScript Compiler

ESLint

PostCSS

Image Processing:

HTML5 Canvas API

FileReader API

Blob API

Browser APIs:

Drag & Drop API

Clipboard API

Local Storage

Navigator Share API

Architecture Patterns:

Component-based React structure

Custom React hooks

Responsive mobile-first design

📹 Demo Drive Folder

https://drive.google.com/drive/folders/1DKnugHp7BFJbGWLrkb2Oq28DByM2bivt?usp=drive_link

Made with ❤️ at TinkerHub Useless Projects

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)
