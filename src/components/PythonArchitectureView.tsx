import React, { useState } from 'react';
import { PYTHON_CODEBASE_FILES } from '../data/mockData';
import {
  Terminal,
  Code2,
  Copy,
  Check,
  Download,
  Database,
  Layers,
  Sparkles,
  Server,
  Cpu,
  BookOpen
} from 'lucide-react';

export const PythonArchitectureView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('server.py');
  const [copied, setCopied] = useState(false);

  const fileKeys = [
    'server.py',
    'database.py',
    'spaced_repetition.py',
    'scheduler.py',
    'analytics.py',
    'gemini_service.py',
    'app.py',
    'models.py',
    'requirements.txt'
  ];

  // Extended code snippets
  const getFileContent = (filename: string): string => {
    if (filename === 'server.py') {
      return `"""
CognitivePath: Pure Python REST API Server
Powered by SQLite3, SM-2 Spaced Repetition, and Gemini API.
Runs locally on port 5001.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, date

from database import get_connection, init_db, seed_default_data
from spaced_repetition import calculate_sm2_review
from scheduler import generate_daily_schedule, calculate_priority_score
from analytics import analyze_weaknesses
from gemini_service import get_study_recommendation, generate_quiz

PORT = 5001

class CognitivePathHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        # Exposes /api/student, /api/topics, /api/schedule, /api/revisions, /api/analytics
        # Connects directly to SQLite learning_platform.db
        ...
`;
    }

    if (filename === 'gemini_service.py') {
      return `"""
Gemini AI Integration Service in Python
Leverages Gemini 3.8 Flash for intelligent study advice, quiz generation, and roadmaps.
"""
import os, json, urllib.request

API_KEY = os.environ.get('GEMINI_API_KEY', '')

def call_gemini(prompt: str, json_mode: bool = True) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={API_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    if json_mode:
        payload["generationConfig"] = {"responseMimeType": "application/json"}
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=12) as response:
        res = json.loads(response.read().decode('utf-8'))
        return res['candidates'][0]['content']['parts'][0]['text']
`;
    }

    return (PYTHON_CODEBASE_FILES as any)[filename] || '# File ready for download';
  };

  const handleCopyCode = () => {
    const code = getFileContent(selectedFile);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const code = getFileContent(selectedFile);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232838] pb-6">
        <div>
          <div className="text-xs font-sans tracking-widest text-[#f6c492] uppercase mb-1">
            Engine & Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#fdf8f5]">
            Python Core Backend & Mentorship Hub
          </h1>
          <p className="text-xs text-[#8c94a4] font-light max-w-xl mt-1 leading-relaxed">
            Examine the SQLite relational schema, SM-2 retention engine algorithms, and download standalone runnable Python files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFile}</span>
          </button>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-serif text-[#fdf8f5] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#f6c492]" />
          <span>Multi-Tier Architecture & Data Flow</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Layer 1 */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232838] space-y-1.5">
            <div className="font-mono text-[#f6c492] text-[10px] font-bold">01. CLIENT TIER</div>
            <h3 className="font-serif text-base text-white">Vite & React Frontend</h3>
            <p className="text-[#8c94a4] text-[11px] font-light leading-relaxed">
              Alpine study windows, SM-2 flashcard recall salon, and diagnostic assessment arena.
            </p>
          </div>

          {/* Layer 2 */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232838] space-y-1.5">
            <div className="font-mono text-[#f6c492] text-[10px] font-bold">02. GATEWAY & PROXY</div>
            <h3 className="font-serif text-base text-white">Node / Express Gateway</h3>
            <p className="text-[#8c94a4] text-[11px] font-light leading-relaxed">
              Listens on port 3000, manages dev lifecycle, and forwards /api/* calls to Python backend.
            </p>
          </div>

          {/* Layer 3 */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232838] space-y-1.5">
            <div className="font-mono text-[#e28766] text-[10px] font-bold">03. PYTHON BUSINESS CORE</div>
            <h3 className="font-serif text-base text-white">Python 3.10 Backend</h3>
            <p className="text-[#8c94a4] text-[11px] font-light leading-relaxed">
              SuperMemo SM-2 retention intervals, adaptive priority scoring queue, and Gemini service.
            </p>
          </div>

          {/* Layer 4 */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232838] space-y-1.5">
            <div className="font-mono text-[#a7f3d0] text-[10px] font-bold">04. PERSISTENT STORAGE</div>
            <h3 className="font-serif text-base text-white">SQLite3 Database</h3>
            <p className="text-[#8c94a4] text-[11px] font-light leading-relaxed">
              ACID storage for profiles, topics, revision histories, study sessions, and quiz logs.
            </p>
          </div>
        </div>
      </div>

      {/* Code Browser & File Viewer */}
      <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl overflow-hidden">
        {/* File Tabs */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0e14] border-b border-[#232838] overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5">
            {fileKeys.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors whitespace-nowrap ${
                  selectedFile === file
                    ? 'bg-[#181d2a] text-[#f6c492] font-semibold border border-[#2b3144]'
                    : 'text-[#8c94a4] hover:text-[#ede7e1]'
                }`}
              >
                {file}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-4 shrink-0">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#181d2a] hover:bg-[#1e2436] text-[#c7cbd4] text-xs font-medium transition-colors border border-[#232838]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#a7f3d0]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-5 bg-[#0b0e14] font-mono text-xs overflow-x-auto max-h-[500px]">
          <pre className="text-[#c7cbd4] leading-relaxed">
            <code>{getFileContent(selectedFile)}</code>
          </pre>
        </div>
      </div>

      {/* Local Setup & Execution Guide */}
      <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-serif text-[#fdf8f5] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#f6c492]" />
          <span>Local Python Execution Steps</span>
        </h3>

        <div className="space-y-3 text-xs text-[#c7cbd4]">
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#232838] font-mono text-[11px] space-y-2 text-[#ede7e1]">
            <div className="text-[#697285]"># 1. Initialize environment</div>
            <div>python3 -m venv venv && source venv/bin/activate</div>

            <div className="text-[#697285] pt-2"># 2. Install dependencies</div>
            <div>pip install streamlit pandas numpy plotly SQLAlchemy pydantic</div>

            <div className="text-[#697285] pt-2"># 3. Launch Streamlit UI</div>
            <div className="text-[#f6c492] font-semibold">streamlit run app.py</div>

            <div className="text-[#697285] pt-2"># Or start the Python REST API server</div>
            <div className="text-[#e28766] font-semibold">python3 backend/server.py</div>
          </div>
        </div>
      </div>
    </div>
  );
};
