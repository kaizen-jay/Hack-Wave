import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_PORT = 5001;

app.use(express.json());

// Initialize Gemini SDK client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini client warning:', err);
  }
}

// Spawn the Python backend service
let pythonProcess: ChildProcess | null = null;

function startPythonBackend() {
  const pythonScript = path.resolve(__dirname, 'backend', 'server.py');
  console.log('Spawning Python backend server:', pythonScript);

  pythonProcess = spawn('python3', [pythonScript], {
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    stdio: 'inherit'
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python backend service:', err);
  });

  pythonProcess.on('exit', (code, signal) => {
    console.warn(`Python backend exited with code ${code}, signal ${signal}. Restarting in 2s...`);
    setTimeout(startPythonBackend, 2000);
  });
}

// Start Python daemon
startPythonBackend();

// Graceful cleanup
process.on('exit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

// Helper to proxy request to Python service
function proxyToPython(req: express.Request, res: express.Response) {
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: PYTHON_PORT,
    path: req.originalUrl,
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Content-Length': req.body ? Buffer.byteLength(JSON.stringify(req.body)) : 0
    },
    timeout: 10000
  };

  const pyReq = http.request(options, (pyRes) => {
    res.writeHead(pyRes.statusCode || 200, pyRes.headers);
    pyRes.pipe(res);
  });

  pyReq.on('error', (err) => {
    console.warn('Proxy to Python backend error, falling back:', err.message);
    // If Python service is still starting up or unavailable, respond gracefully
    res.status(503).json({
      error: 'Python backend initializing',
      fallback: true
    });
  });

  pyReq.on('timeout', () => {
    pyReq.destroy();
    res.status(504).json({ error: 'Python backend timeout' });
  });

  if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
    pyReq.write(JSON.stringify(req.body));
  }
  pyReq.end();
}

// Direct AI endpoint enhancement with @google/genai (Gemini 3.8 Flash)
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { student, weakTopics, upcomingDeadlines } = req.body;

    if (!aiClient) {
      return res.json({
        source: 'python_heuristic_engine',
        advice: `Based on your exam deadlines in ${upcomingDeadlines?.[0]?.subject || 'your subjects'} and weakness in ${weakTopics?.[0]?.name || 'key concepts'}, allocate 65% of your available hours to active practice quizzes and high-priority revision first. Keep study intervals within 45-minute blocks.`,
        priorityAdjustments: [
          { topic: weakTopics?.[0]?.name || 'Core Fundamentals', reason: 'Accuracy below 60% with approaching exam date', recommendedMinutes: 45 },
          { topic: upcomingDeadlines?.[0]?.subject || 'Upcoming Assessment', reason: 'High deadline urgency weight', recommendedMinutes: 60 }
        ]
      });
    }

    const prompt = `You are a senior computer science professor and personal study mentor.
Student Context:
- Target Career: ${student?.careerGoal || 'Software Engineer'}
- Weekly Study Target: ${student?.weeklyTargetHours || 14} hours
- Weak Topics identified by quiz diagnostics: ${JSON.stringify(weakTopics)}
- Upcoming Deadlines: ${JSON.stringify(upcomingDeadlines)}

Provide a concise, practical, actionable study recommendation (under 120 words) explaining why specific topics are prioritized, and suggest 2-3 specific tactical study habits (e.g. Feynman technique, test-driven study, spaced flashcards). Return response in JSON with keys: 'advice' (string) and 'priorityAdjustments' (array of {topic, reason, recommendedMinutes}).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ source: 'gemini-3.8-flash', ...parsed });
  } catch (err: any) {
    console.error('Error generating enhanced AI recommendation:', err);
    return res.json({
      source: 'heuristic_fallback',
      advice: 'Allocate 70% of study time to detected weak topics with upcoming exam proximity. Focus on active recall and practice problems.',
      priorityAdjustments: []
    });
  }
});

app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { topic = 'Algorithms', difficulty = 'Medium', count = 3 } = req.body;

    if (!aiClient) {
      return res.json({
        topic,
        questions: [
          {
            id: 'gen-1',
            question: `In ${topic}, what is the time complexity trade-off when optimizing memory footprint?`,
            options: [
              'Space optimization always improves time complexity',
              'Space-time trade-off often increases computation steps to reduce memory footprint',
              'Memory allocation has zero impact on caching and latency',
              'Garbage collection eliminates all overhead'
            ],
            correctAnswerIndex: 1,
            explanation: 'Algorithms frequently trade additional CPU computation cycles to compress or reconstruct data within tighter memory bounds.',
            difficulty
          }
        ]
      });
    }

    const prompt = `Generate ${count} high-quality, practical multiple-choice diagnostic questions on the topic "${topic}" at difficulty level "${difficulty}".
For each question, provide:
- question: clear, precise scenario or concept question
- options: array of 4 distinct answers
- correctAnswerIndex: 0-3 index
- explanation: educational explanation of why the correct answer is right and common pitfalls
Return valid JSON as an object: { "questions": [ ... ] }`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ topic, questions: parsed.questions || [] });
  } catch (err: any) {
    console.warn('AI quiz generation fallback:', err);
    return res.json({
      topic: req.body?.topic || 'Topic',
      questions: [
        {
          id: 'fb-1',
          question: `What fundamental invariant governs correctness in ${req.body?.topic || 'this domain'}?`,
          options: [
            'State preservation across recursive subproblem transitions',
            'Constant time execution across all hardware architectures',
            'Elimination of all pointer references',
            'Unbounded memory consumption'
          ],
          correctAnswerIndex: 0,
          explanation: 'Preserving state invariants ensures induction holds across all subproblems.',
          difficulty: 'Medium'
        }
      ]
    });
  }
});

// All other /api/* routes proxy directly to the Python SQLite / SM-2 backend
app.all('/api/*', (req, res) => {
  proxyToPython(req, res);
});

// Vite Middleware Setup for Dev Server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Frontend & Gateway Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
