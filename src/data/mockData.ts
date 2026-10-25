import {
  StudentProfile,
  Topic,
  ExamDeadline,
  StudySession,
  RevisionItem,
  QuizAttempt,
  QuizQuestion,
  CareerRoadmap
} from '../types';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-alex',
    name: 'Alex Rivera',
    roleDescription: 'Computer Science Sophomore · AI/ML Track',
    avatarUrl: '/src/assets/images/student_avatar_alex_1792909758474.jpg',
    careerGoal: 'AI / Machine Learning Engineer',
    targetGraduationOrInternship: 'Summer 2027 Tech Internship',
    weeklyTargetHours: 16,
    dailyAvailableHours: 3.5,
    currentSkills: [
      'Python Syntax & Basics',
      'Object-Oriented Programming',
      'Git & GitHub',
      'Arrays & Hash Maps',
      'Relational Schema Design',
      'Basic SQL Queries'
    ],
    subjects: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Linear Algebra & Calculus',
      'Operating Systems'
    ],
    examDeadlines: [
      {
        id: 'dl-1',
        subject: 'Data Structures & Algorithms',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days away!
        weight: 5,
        notes: 'Midterm covering Trees, Graphs, DP, and Complexity analysis'
      },
      {
        id: 'dl-2',
        subject: 'Database Management Systems',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days away
        weight: 4,
        notes: 'Indexing, B+ Trees, Transactions, and Normalization'
      },
      {
        id: 'dl-3',
        subject: 'Linear Algebra & Calculus',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: 4,
        notes: 'Eigenvectors, SVD, and Multivariable Gradients'
      }
    ]
  },
  {
    id: 'student-priya',
    name: 'Priya Sharma',
    roleDescription: 'Junior Data Science Major · Analytics Aspirant',
    avatarUrl: '/src/assets/images/student_avatar_alex_1792909758474.jpg',
    careerGoal: 'Data Analyst & Python Specialist',
    targetGraduationOrInternship: 'Fall 2026 Co-op',
    weeklyTargetHours: 14,
    dailyAvailableHours: 3.0,
    currentSkills: [
      'Python Data Structures',
      'SQL Aggregate Queries',
      'Pandas DataFrame Wrangling',
      'Matplotlib & Seaborn',
      'Descriptive Statistics'
    ],
    subjects: [
      'Applied Business Statistics',
      'Advanced SQL & Data Warehousing',
      'Machine Learning Foundations'
    ],
    examDeadlines: [
      {
        id: 'dl-4',
        subject: 'Applied Business Statistics',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: 5,
        notes: 'Hypothesis Testing, ANOVA, and Regression Analysis'
      },
      {
        id: 'dl-5',
        subject: 'Advanced SQL & Data Warehousing',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: 4,
        notes: 'Window Functions, CTEs, and Star Schema'
      }
    ]
  }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'top-1',
    subject: 'Data Structures & Algorithms',
    name: 'Dynamic Programming & Memoization',
    difficulty: 5,
    importance: 5,
    accuracyRate: 0.42, // Weak area!
    totalQuizAttempts: 4,
    lastStudiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: true,
    notes: 'Struggling with recurrence relations in 2D knapsack and longest common subsequence.'
  },
  {
    id: 'top-2',
    subject: 'Data Structures & Algorithms',
    name: 'Graph Traversal (BFS & DFS)',
    difficulty: 3,
    importance: 4,
    accuracyRate: 0.82,
    totalQuizAttempts: 5,
    lastStudiedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: false,
    notes: 'Comfortable with adjacency lists and topological sort.'
  },
  {
    id: 'top-3',
    subject: 'Database Management Systems',
    name: 'B+ Trees & Database Indexing Mechanics',
    difficulty: 4,
    importance: 5,
    accuracyRate: 0.48, // Weak area!
    totalQuizAttempts: 3,
    lastStudiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: true,
    notes: 'Understanding split algorithms and clustered vs secondary index disk accesses.'
  },
  {
    id: 'top-4',
    subject: 'Database Management Systems',
    name: 'ACID Properties & Transaction Isolation',
    difficulty: 4,
    importance: 4,
    accuracyRate: 0.76,
    totalQuizAttempts: 4,
    lastStudiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: false,
    notes: 'Read committed vs Serializable locking.'
  },
  {
    id: 'top-5',
    subject: 'Linear Algebra & Calculus',
    name: 'Matrix Eigenvalues & Eigenvectors',
    difficulty: 4,
    importance: 5,
    accuracyRate: 0.55,
    totalQuizAttempts: 2,
    lastStudiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: true,
    notes: 'Diagonalization and geometric interpretation in PCA.'
  },
  {
    id: 'top-6',
    subject: 'Data Structures & Algorithms',
    name: 'Binary Search & Monotonic Predicates',
    difficulty: 3,
    importance: 4,
    accuracyRate: 0.90,
    totalQuizAttempts: 6,
    lastStudiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    needsRevision: false,
    notes: 'Mastered boundary conditions.'
  }
];

export const INITIAL_REVISIONS: RevisionItem[] = [
  {
    id: 'rev-1',
    topicId: 'top-1',
    topicName: 'Dynamic Programming & Memoization',
    subject: 'Data Structures & Algorithms',
    dueDate: new Date().toISOString().split('T')[0], // Due TODAY!
    intervalDays: 3,
    repetitionCount: 1,
    easeFactor: 2.1,
    status: 'due',
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reviewHistory: [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 2, intervalDays: 1 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 2, intervalDays: 3 }
    ]
  },
  {
    id: 'rev-2',
    topicId: 'top-3',
    topicName: 'B+ Trees & Database Indexing Mechanics',
    subject: 'Database Management Systems',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // OVERDUE by 2 days!
    intervalDays: 4,
    repetitionCount: 1,
    easeFactor: 2.3,
    status: 'overdue',
    lastReviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reviewHistory: [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 2, intervalDays: 2 }
    ]
  },
  {
    id: 'rev-3',
    topicId: 'top-4',
    topicName: 'ACID Properties & Transaction Isolation',
    subject: 'Database Management Systems',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Upcoming in 2 days
    intervalDays: 7,
    repetitionCount: 2,
    easeFactor: 2.5,
    status: 'upcoming',
    lastReviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reviewHistory: [
      { date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 3, intervalDays: 3 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 3, intervalDays: 7 }
    ]
  },
  {
    id: 'rev-4',
    topicId: 'top-6',
    topicName: 'Binary Search & Monotonic Predicates',
    subject: 'Data Structures & Algorithms',
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    intervalDays: 21,
    repetitionCount: 4,
    easeFactor: 2.7,
    status: 'mastered',
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reviewHistory: [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 3, intervalDays: 3 },
      { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 4, intervalDays: 8 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rating: 4, intervalDays: 21 }
    ]
  }
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-today-1',
    topicId: 'top-1',
    topicName: 'Dynamic Programming & Memoization',
    subject: 'Data Structures & Algorithms',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 - 09:50',
    scheduledMinutes: 50,
    status: 'planned',
    priorityScore: 92,
    reasonPrioritized: 'Exam in 3d · Weak accuracy (42%) · Revision Due Today'
  },
  {
    id: 'sess-today-2',
    topicId: 'top-3',
    topicName: 'B+ Trees & Database Indexing Mechanics',
    subject: 'Database Management Systems',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:15 - 11:05',
    scheduledMinutes: 50,
    status: 'planned',
    priorityScore: 78,
    reasonPrioritized: 'Exam next week (10d away) · Weak accuracy (48%) · Overdue Spaced Revision'
  },
  {
    id: 'sess-today-3',
    topicId: 'top-5',
    topicName: 'Matrix Eigenvalues & Eigenvectors',
    subject: 'Linear Algebra & Calculus',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '14:00 - 14:50',
    scheduledMinutes: 50,
    status: 'planned',
    priorityScore: 54,
    reasonPrioritized: 'Exam in 21d · Accuracy: 55% · Standard review'
  },
  {
    id: 'sess-yesterday-1',
    topicId: 'top-6',
    topicName: 'Binary Search & Monotonic Predicates',
    subject: 'Data Structures & Algorithms',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeSlot: '16:00 - 16:50',
    scheduledMinutes: 50,
    actualMinutes: 45,
    status: 'completed',
    priorityScore: 40,
    reasonPrioritized: 'Regular practice session',
    notes: 'Completed 3 LeetCode medium questions with clean binary search invariants.'
  }
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'qa-1',
    topicId: 'top-1',
    topicName: 'Dynamic Programming & Memoization',
    subject: 'Data Structures & Algorithms',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalQuestions: 5,
    correctCount: 2,
    scorePercentage: 40,
    durationSeconds: 340
  },
  {
    id: 'qa-2',
    topicId: 'top-3',
    topicName: 'B+ Trees & Database Indexing Mechanics',
    subject: 'Database Management Systems',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalQuestions: 5,
    correctCount: 2,
    scorePercentage: 40,
    durationSeconds: 290
  },
  {
    id: 'qa-3',
    topicId: 'top-4',
    topicName: 'ACID Properties & Transaction Isolation',
    subject: 'Database Management Systems',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalQuestions: 4,
    correctCount: 3,
    scorePercentage: 75,
    durationSeconds: 210
  },
  {
    id: 'qa-4',
    topicId: 'top-2',
    topicName: 'Graph Traversal (BFS & DFS)',
    subject: 'Data Structures & Algorithms',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalQuestions: 5,
    correctCount: 4,
    scorePercentage: 80,
    durationSeconds: 310
  }
];

export const QUESTION_BANK: Record<string, QuizQuestion[]> = {
  'top-1': [
    {
      id: 'q-dp-1',
      topicId: 'top-1',
      topicName: 'Dynamic Programming & Memoization',
      question: 'When solving the 0/1 Knapsack problem, what state does the DP table entry dp[i][w] typically represent?',
      options: [
        'The maximum value obtainable using a subset of the first i items with weight capacity w',
        'The exact weight of the first i items when total value equals w',
        'The number of distinct combinations of items that sum to exactly capacity w',
        'The minimum number of items required to achieve value w'
      ],
      correctAnswerIndex: 0,
      explanation: 'In 0/1 Knapsack, dp[i][w] represents the optimal value considering the first i items under capacity limit w. Each item is either included (if weight permits) or excluded.',
      difficulty: 'Hard'
    },
    {
      id: 'q-dp-2',
      topicId: 'top-1',
      topicName: 'Dynamic Programming & Memoization',
      question: 'What is the primary technical difference between Top-Down Memoization and Bottom-Up Tabulation?',
      options: [
        'Tabulation has asymptotically lower space complexity in every case',
        'Memoization uses recursion with cache lookup on demand; Tabulation builds iteratively in topological order',
        'Memoization only works for 1D arrays while Tabulation supports n-dimensional state spaces',
        'Tabulation requires solving all subproblems recursively first'
      ],
      correctAnswerIndex: 1,
      explanation: 'Memoization is recursive and only computes reachable states on-demand. Tabulation is iterative, avoiding call-stack recursion overhead by computing all dependency states systematically.',
      difficulty: 'Medium'
    },
    {
      id: 'q-dp-3',
      topicId: 'top-1',
      topicName: 'Dynamic Programming & Memoization',
      question: 'In the Longest Common Subsequence (LCS) problem for strings X of length m and Y of length n, what is the standard recurrence when X[i] != Y[j]?',
      options: [
        'dp[i][j] = dp[i-1][j-1]',
        'dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
        'dp[i][j] = dp[i-1][j] + dp[i][j-1]',
        'dp[i][j] = 0'
      ],
      correctAnswerIndex: 1,
      explanation: 'If characters mismatch, the LCS of prefixes must either exclude X[i] or exclude Y[j], yielding max(dp[i-1][j], dp[i][j-1]).',
      difficulty: 'Medium'
    }
  ],
  'top-3': [
    {
      id: 'q-btree-1',
      topicId: 'top-3',
      topicName: 'B+ Trees & Database Indexing Mechanics',
      question: 'Why do relational database engines prefer B+ Trees over standard Binary Search Trees (BST) for disk-backed indexing?',
      options: [
        'BST trees require logarithmic disk reads whereas B+ Trees use constant time',
        'B+ Trees have a high branching factor (fanout), drastically minimizing disk block I/O operations',
        'B+ Trees compress strings into integers before sorting',
        'Binary search trees cannot maintain sorted order under continuous inserts'
      ],
      correctAnswerIndex: 1,
      explanation: 'Disk page reads are the primary performance bottleneck in databases. High fanout (often 100-500 keys per node) means a B+ Tree index with millions of rows has a tree height of only 3-4 levels.',
      difficulty: 'Hard'
    },
    {
      id: 'q-btree-2',
      topicId: 'top-3',
      topicName: 'B+ Trees & Database Indexing Mechanics',
      question: 'What structural property distinguishes leaf nodes from internal nodes in a B+ Tree?',
      options: [
        'Leaf nodes hold pointers to left and right parent nodes',
        'Leaf nodes store actual record pointers/values and are linked sequentially in a doubly-linked list for fast range scans',
        'Internal nodes store rows and leaf nodes only store column headers',
        'Leaf nodes cannot be split when full'
      ],
      correctAnswerIndex: 1,
      explanation: 'In B+ Trees, all data/pointers reside in the leaves, which are linked together. This enables rapid sequential scans (e.g. WHERE age BETWEEN 20 AND 30) without backtracking through internal nodes.',
      difficulty: 'Medium'
    }
  ],
  'top-4': [
    {
      id: 'q-acid-1',
      topicId: 'top-4',
      topicName: 'ACID Properties & Transaction Isolation',
      question: 'Which phenomenon occurs when Transaction A reads a row, Transaction B modifies and commits the row, and Transaction A reads it again getting different values?',
      options: [
        'Dirty Read',
        'Non-Repeatable Read (Fuzzy Read)',
        'Phantom Read',
        'Deadlock Rollback'
      ],
      correctAnswerIndex: 1,
      explanation: 'A Non-Repeatable Read happens when existing rows read previously by a transaction are modified and committed by another transaction before the first completes.',
      difficulty: 'Medium'
    }
  ]
};

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: 'rm-ai-ml',
    careerId: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    description: 'Master mathematical foundations, algorithmic model training, deep neural architectures, and scalable production MLOps deployment.',
    estimatedMonths: 9,
    stages: [
      {
        id: 'stg-1',
        stageNumber: 1,
        stageName: 'Mathematical & Programming Foundations',
        description: 'Core linear algebra, multivariable gradients, and idiomatic Python data structures.',
        skills: [
          { id: 'sk-py', name: 'Python Syntax & OOP', category: 'Programming', status: 'completed', prerequisites: [], estimatedHours: 40, description: 'Classes, dunder methods, generators, exceptions, packaging' },
          { id: 'sk-linalg', name: 'Linear Algebra & Matrix Decompositions', category: 'Math', status: 'in_progress', prerequisites: ['sk-py'], estimatedHours: 50, description: 'Vector spaces, eigenvalues, SVD, matrix calculus' },
          { id: 'sk-prob', name: 'Probability & Inferential Statistics', category: 'Math', status: 'not_started', prerequisites: [], estimatedHours: 45, description: 'Bayes rule, probability distributions, maximum likelihood estimation' },
          { id: 'sk-numpy', name: 'NumPy & Vectorized Computing', category: 'Libraries', status: 'completed', prerequisites: ['sk-py'], estimatedHours: 30, description: 'Broadcasting, tensor slicing, numerical stability' }
        ],
        projects: [
          { id: 'p-1', title: 'Vectorized Neural Network from Scratch in NumPy', description: 'Implement forward propagation, backpropagation, and Adam optimizer without ML libraries.', skillsDemonstrated: ['Python Syntax & OOP', 'NumPy & Vectorized Computing', 'Linear Algebra & Matrix Decompositions'], difficulty: 'Intermediate' }
        ]
      },
      {
        id: 'stg-2',
        stageNumber: 2,
        stageName: 'Applied Machine Learning & Feature Engineering',
        description: 'Supervised and unsupervised learning algorithms, model evaluation, and validation metrics.',
        skills: [
          { id: 'sk-scikit', name: 'Scikit-Learn & Feature Pipelines', category: 'Libraries', status: 'in_progress', prerequisites: ['sk-numpy'], estimatedHours: 50, description: 'Cross-validation, hyperparameter tuning, imputation, column transformers' },
          { id: 'sk-trees', name: 'Tree Ensembles (XGBoost / LightGBM)', category: 'Algorithms', status: 'not_started', prerequisites: ['sk-scikit'], estimatedHours: 40, description: 'Gradient boosting, loss function optimization, regularization' },
          { id: 'sk-metrics', name: 'Model Evaluation & Error Analysis', category: 'Theory', status: 'not_started', prerequisites: ['sk-scikit'], estimatedHours: 30, description: 'ROC-AUC, Precision-Recall trade-offs, SHAP values, feature importance' }
        ],
        projects: [
          { id: 'p-2', title: 'End-to-End Tabular Prediction Pipeline with Explainability', description: 'Build an automated regression/classification engine with SHAP interpretability and validation.', skillsDemonstrated: ['Scikit-Learn & Feature Pipelines', 'Model Evaluation & Error Analysis'], difficulty: 'Intermediate' }
        ]
      },
      {
        id: 'stg-3',
        stageNumber: 3,
        stageName: 'Deep Learning & Modern Generative Architectures',
        description: 'PyTorch deep neural networks, CNNs, Transformers, and modern LLM application engineering.',
        skills: [
          { id: 'sk-pytorch', name: 'PyTorch Core & Autograd', category: 'Frameworks', status: 'not_started', prerequisites: ['sk-scikit', 'sk-linalg'], estimatedHours: 65, description: 'nn.Module, custom Datasets/DataLoaders, GPU tensors, training loops' },
          { id: 'sk-transformers', name: 'Attention Mechanisms & Transformers', category: 'Architectures', status: 'not_started', prerequisites: ['sk-pytorch'], estimatedHours: 60, description: 'Self-attention, multi-head attention, positional encodings, HuggingFace' },
          { id: 'sk-rag', name: 'Vector Search & Retrieval Augmented Generation', category: 'GenAI', status: 'not_started', prerequisites: ['sk-transformers'], estimatedHours: 40, description: 'Embeddings, vector databases, chunking strategies, hybrid retrieval' }
        ],
        projects: [
          { id: 'p-3', title: 'Domain-Specific RAG Knowledge Engine with Evaluation Benchmarks', description: 'Deploy a grounded technical research assistant using dense embeddings and reranking.', skillsDemonstrated: ['PyTorch Core & Autograd', 'Vector Search & Retrieval Augmented Generation'], difficulty: 'Advanced' }
        ]
      },
      {
        id: 'stg-4',
        stageNumber: 4,
        stageName: 'Production MLOps & Scalable Serving',
        description: 'Containerization, model registries, low-latency inference APIs, and drift monitoring.',
        skills: [
          { id: 'sk-fastapi', name: 'FastAPI High-Performance Serving', category: 'Backend', status: 'not_started', prerequisites: ['sk-py'], estimatedHours: 35, description: 'Async endpoints, Pydantic validation, streaming responses' },
          { id: 'sk-docker', name: 'Docker & Microservice Containerization', category: 'DevOps', status: 'not_started', prerequisites: [], estimatedHours: 30, description: 'Multi-stage builds, GPU container runtimes, image optimization' },
          { id: 'sk-mlops', name: 'Model Monitoring & CI/CD Pipelines', category: 'MLOps', status: 'not_started', prerequisites: ['sk-docker', 'sk-fastapi'], estimatedHours: 45, description: 'Data drift detection, Prometheus metrics, GitHub Actions CI/CD' }
        ],
        projects: [
          { id: 'p-4', title: 'Productionized Model Serving Cluster with Latency Monitoring', description: 'Deploy containerized inference pipeline with Prometheus latency alerts and batching.', skillsDemonstrated: ['FastAPI High-Performance Serving', 'Docker & Microservice Containerization', 'Model Monitoring & CI/CD Pipelines'], difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'rm-python-dev',
    careerId: 'python-developer',
    title: 'Python Backend Software Engineer',
    description: 'Build robust scalable backend microservices, async APIs, relational database architectures, and distributed queues.',
    estimatedMonths: 7,
    stages: [
      {
        id: 'py-stg-1',
        stageNumber: 1,
        stageName: 'Advanced Python Language Mastery',
        description: 'Memory models, concurrency, decorators, type hints, and metaprogramming.',
        skills: [
          { id: 'py-sk-1', name: 'Python Syntax & Basics', category: 'Core', status: 'completed', prerequisites: [], estimatedHours: 30, description: 'Core syntax, built-in collections, functions' },
          { id: 'py-sk-2', name: 'Asyncio & Concurrency', category: 'Core', status: 'in_progress', prerequisites: ['py-sk-1'], estimatedHours: 40, description: 'Event loops, coroutines, tasks, threading vs multiprocessing' },
          { id: 'py-sk-3', name: 'Type Annotations & Pydantic', category: 'Tooling', status: 'completed', prerequisites: ['py-sk-1'], estimatedHours: 25, description: 'Mypy static analysis, strict data validation models' }
        ],
        projects: [
          { id: 'py-p-1', title: 'Asynchronous Web Scraper & Task Engine', description: 'High-throughput async crawler with rate limiting, retry backoff, and SQLite caching.', skillsDemonstrated: ['Asyncio & Concurrency', 'Type Annotations & Pydantic'], difficulty: 'Intermediate' }
        ]
      },
      {
        id: 'py-stg-2',
        stageNumber: 2,
        stageName: 'Databases & ORM Architecture',
        description: 'Relational data modeling, query optimization, indexing, and SQLAlchemy 2.0.',
        skills: [
          { id: 'py-sk-4', name: 'SQL Schema Design & Normalization', category: 'Database', status: 'completed', prerequisites: [], estimatedHours: 35, description: '1NF-3NF, foreign keys, cascading constraints' },
          { id: 'py-sk-5', name: 'SQLAlchemy 2.0 ORM & Alembic', category: 'Database', status: 'in_progress', prerequisites: ['py-sk-4'], estimatedHours: 45, description: 'Declarative base, async sessions, database migrations' },
          { id: 'py-sk-6', name: 'Redis Caching & Key-Value Stores', category: 'Database', status: 'not_started', prerequisites: [], estimatedHours: 25, description: 'TTL caching, pub/sub, distributed locks' }
        ],
        projects: [
          { id: 'py-p-2', title: 'E-Commerce Inventory Service with Optimistic Locking', description: 'Robust transactional stock reservation system with ACID compliance and Alembic migrations.', skillsDemonstrated: ['SQLAlchemy 2.0 ORM & Alembic', 'Redis Caching & Key-Value Stores'], difficulty: 'Intermediate' }
        ]
      },
      {
        id: 'py-stg-3',
        stageNumber: 3,
        stageName: 'Production Web Frameworks & APIs',
        description: 'FastAPI, authentication, OpenAPI specifications, and integration testing.',
        skills: [
          { id: 'py-sk-7', name: 'FastAPI REST Architecture', category: 'Frameworks', status: 'not_started', prerequisites: ['py-sk-2', 'py-sk-5'], estimatedHours: 40, description: 'Dependency injection, middleware, OAuth2 JWT auth' },
          { id: 'py-sk-8', name: 'Pytest & Integration Test Suites', category: 'Testing', status: 'not_started', prerequisites: ['py-sk-7'], estimatedHours: 30, description: 'Fixtures, mock servers, coverage reports, test DB isolation' }
        ],
        projects: [
          { id: 'py-p-3', title: 'Collaborative Document Backend with WebSockets', description: 'Real-time collaborative editing service with JWT tokens, session isolation, and pytest coverage.', skillsDemonstrated: ['FastAPI REST Architecture', 'Pytest & Integration Test Suites'], difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'rm-data-analyst',
    careerId: 'data-analyst',
    title: 'Data Analyst & BI Specialist',
    description: 'Transform raw multi-source business data into actionable dashboards, statistical experiments, and analytical reports.',
    estimatedMonths: 6,
    stages: [
      {
        id: 'da-stg-1',
        stageNumber: 1,
        stageName: 'Advanced SQL & Data Modeling',
        description: 'Complex window queries, star schemas, aggregation, and performance tuning.',
        skills: [
          { id: 'da-sk-1', name: 'SQL Window Functions & CTEs', category: 'SQL', status: 'completed', prerequisites: [], estimatedHours: 35, description: 'ROW_NUMBER, RANK, LAG/LEAD, recursive queries' },
          { id: 'da-sk-2', name: 'Dimensional Modeling & Star Schemas', category: 'Data', status: 'not_started', prerequisites: ['da-sk-1'], estimatedHours: 30, description: 'Fact vs dimension tables, slowly changing dimensions' }
        ],
        projects: [
          { id: 'da-p-1', title: 'SaaS Cohort Retention & Churn Analysis in SQL', description: 'Compute customer cohort retention matrices and churn rates using advanced window functions.', skillsDemonstrated: ['SQL Window Functions & CTEs'], difficulty: 'Beginner' }
        ]
      },
      {
        id: 'da-stg-2',
        stageNumber: 2,
        stageName: 'Python for Analytical Computing',
        description: 'Data wrangling with Pandas, exploratory data analysis, and data cleaning.',
        skills: [
          { id: 'da-sk-3', name: 'Pandas Data Wrangling & Reshaping', category: 'Python', status: 'completed', prerequisites: [], estimatedHours: 40, description: 'GroupBy, merge/join, pivot tables, handling missing values' },
          { id: 'da-sk-4', name: 'Exploratory Data Analysis & Visualization', category: 'Python', status: 'in_progress', prerequisites: ['da-sk-3'], estimatedHours: 35, description: 'Distribution plots, correlation heatmaps, Plotly interactive charts' }
        ],
        projects: [
          { id: 'da-p-2', title: 'Marketing Attribution & Customer Segmentation Dashboard', description: 'Interactive Plotly dashboard analyzing campaign ROI and RFM customer segmentation.', skillsDemonstrated: ['Pandas Data Wrangling & Reshaping', 'Exploratory Data Analysis & Visualization'], difficulty: 'Intermediate' }
        ]
      }
    ]
  }
];

export const PYTHON_CODEBASE_FILES = {
  'requirements.txt': `# CognitivePath - Python Personalized Learning Platform
# Requirements specification for local execution
streamlit>=1.35.0
pandas>=2.2.0
numpy>=1.26.0
plotly>=5.22.0
SQLAlchemy>=2.0.30
pydantic>=2.7.0
python-dateutil>=2.9.0
`,
  'models.py': `"""
CognitivePath: Database Models (SQLAlchemy ORM)
Defines relational schema for student profiles, subjects, study sessions,
spaced repetition flashcards, and diagnostic quiz records.
"""
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Date, DateTime,
    ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    career_goal = Column(String(120), default="Python Developer")
    weekly_target_hours = Column(Float, default=14.0)
    daily_available_hours = Column(Float, default=3.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    topics = relationship("Topic", back_populates="student", cascade="all, delete-orphan")
    deadlines = relationship("ExamDeadline", back_populates="student", cascade="all, delete-orphan")
    sessions = relationship("StudySession", back_populates="student", cascade="all, delete-orphan")
    revisions = relationship("RevisionCard", back_populates="student", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="student", cascade="all, delete-orphan")

class ExamDeadline(Base):
    __tablename__ = "exam_deadlines"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    exam_date = Column(Date, nullable=False)
    weight = Column(Integer, default=5)  # 1 to 5
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="deadlines")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    name = Column(String(150), nullable=False)
    difficulty = Column(Integer, default=3)  # 1-5
    importance = Column(Integer, default=3)  # 1-5
    accuracy_rate = Column(Float, default=0.5)  # 0.0 to 1.0 from quiz feedback
    total_quiz_attempts = Column(Integer, default=0)
    last_studied_at = Column(Date, nullable=True)

    student = relationship("Student", back_populates="topics")
    revisions = relationship("RevisionCard", back_populates="topic")

class RevisionCard(Base):
    __tablename__ = "revision_cards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    due_date = Column(Date, nullable=False)
    interval_days = Column(Integer, default=1)
    repetition_count = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5)  # SM-2 default
    status = Column(String(20), default="due")  # due, upcoming, overdue, mastered
    last_reviewed_at = Column(Date, nullable=True)

    student = relationship("Student", back_populates="revisions")
    topic = relationship("Topic", back_populates="revisions")

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(150), nullable=False)
    subject = Column(String(100), nullable=False)
    session_date = Column(Date, nullable=False)
    scheduled_minutes = Column(Integer, default=50)
    actual_minutes = Column(Integer, nullable=True)
    status = Column(String(20), default="planned")  # planned, completed, skipped, rescheduled
    priority_score = Column(Integer, default=50)
    reason_prioritized = Column(Text, nullable=True)

    student = relationship("Student", back_populates="sessions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(150), nullable=False)
    subject = Column(String(100), nullable=False)
    attempt_date = Column(Date, default=date.today)
    total_questions = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    score_percentage = Column(Float, nullable=False)

    student = relationship("Student", back_populates="quiz_attempts")
`,
  'spaced_repetition.py': `"""
SuperMemo SM-2 Spaced Repetition Algorithm
Mathematically schedules optimal review intervals to counteract the Ebbinghaus forgetting curve.
"""
from datetime import date, timedelta
from typing import Tuple

def calculate_sm2(
    current_repetition: int,
    current_interval: int,
    current_ease_factor: float,
    rating: int
) -> Tuple[int, int, float, date]:
    """
    Computes new repetition count, interval (days), ease factor, and due date.
    
    Ratings:
    1 - Again (Failed to recall, complete reset)
    2 - Hard (Recalled with major difficulty)
    3 - Good (Recalled with reasonable hesitation)
    4 - Easy (Immediate, accurate recall)
    """
    # Scale 1-4 rating to SM-2's 2-5 standard scale
    q = rating + 1
    
    # Calculate updated Ease Factor (EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02)))
    new_ef = current_ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if new_ef < 1.3:
        new_ef = 1.3  # SM-2 absolute minimum floor
        
    if rating == 1:
        # Failure: reset repetition streak, repeat tomorrow
        new_repetition = 0
        new_interval = 1
    elif rating == 2:
        new_repetition = current_repetition + 1
        new_interval = max(1, round(current_interval * 1.2))
    elif rating == 3:
        if current_repetition == 0:
            new_interval = 1
        elif current_repetition == 1:
            new_interval = 4
        else:
            new_interval = round(current_interval * new_ef)
        new_repetition = current_repetition + 1
    else:  # Easy (4)
        if current_repetition == 0:
            new_interval = 3
        elif current_repetition == 1:
            new_interval = 7
        else:
            new_interval = round(current_interval * new_ef * 1.3)
        new_repetition = current_repetition + 1
        
    next_due_date = date.today() + timedelta(days=new_interval)
    return new_repetition, new_interval, round(new_ef, 2), next_due_date
`,
  'scheduler.py': `"""
CognitivePath: Adaptive Priority Scheduling Engine
Connects deadlines, quiz performance, and revision status to generate optimal study plans.
"""
from datetime import date
from typing import List, Dict, Any

def compute_topic_priority(
    topic: Dict[str, Any],
    deadlines: List[Dict[str, Any]],
    has_overdue_revision: bool,
    has_due_revision: bool
) -> Dict[str, Any]:
    """
    Computes transparent multi-factor priority score.
    Score = DeadlineWeight + WeaknessWeight + IntrinsicWeight + RevisionBonus
    """
    today = date.today()
    subject_deadlines = [
        d for d in deadlines if d['subject'].lower() == topic['subject'].lower()
    ]
    
    deadline_weight = 0
    deadline_reason = ""
    if subject_deadlines:
        # Find nearest upcoming deadline
        nearest = min(subject_deadlines, key=lambda x: (x['exam_date'] - today).days)
        days_left = (nearest['exam_date'] - today).days
        if days_left <= 3:
            deadline_weight = 40 * (nearest.get('weight', 5) / 5)
            deadline_reason = f"Exam in {days_left}d ({nearest['subject']})"
        elif days_left <= 7:
            deadline_weight = 28 * (nearest.get('weight', 5) / 5)
            deadline_reason = f"Exam next week ({days_left}d away)"
        elif days_left <= 14:
            deadline_weight = 16 * (nearest.get('weight', 5) / 5)
            deadline_reason = f"Exam in {days_left}d"
        else:
            deadline_weight = 8
            deadline_reason = f"Exam in {days_left}d"
            
    # Weakness penalty from quizzes (up to 35 pts)
    accuracy = topic.get('accuracy_rate', 0.5)
    weakness_weight = (1.0 - accuracy) * 35.0
    weakness_reason = f"Weak accuracy ({round(accuracy * 100)}%)" if accuracy < 0.6 else ""
    
    # Inherent difficulty & importance (up to 20 pts)
    diff = topic.get('difficulty', 3)
    imp = topic.get('importance', 3)
    intrinsic_weight = ((diff * 0.5 + imp * 0.5) / 5.0) * 20.0
    
    # Spaced repetition bonus
    revision_bonus = 15 if has_overdue_revision else (8 if has_due_revision else 0)
    revision_reason = "Overdue Spaced Revision" if has_overdue_revision else ("Revision Due Today" if has_due_revision else "")
    
    total_score = round(deadline_weight + weakness_weight + intrinsic_weight + revision_bonus)
    
    reasons = [r for r in [deadline_reason, weakness_reason, revision_reason] if r]
    reason_str = " · ".join(reasons) if reasons else f"Difficulty {diff}/5 · Importance {imp}/5"
    
    return {
        "score": total_score,
        "reason": reason_str
    }

def generate_daily_schedule(
    topics: List[Dict[str, Any]],
    deadlines: List[Dict[str, Any]],
    revisions: List[Dict[str, Any]],
    available_hours: float
) -> List[Dict[str, Any]]:
    """
    Packs prioritized topics into 45-50 minute actionable study blocks.
    """
    overdue_topic_ids = {r['topic_id'] for r in revisions if r.get('status') == 'overdue'}
    due_topic_ids = {r['topic_id'] for r in revisions if r.get('status') == 'due'}
    
    scored_topics = []
    for t in topics:
        p_info = compute_topic_priority(
            t,
            deadlines,
            has_overdue_revision=t['id'] in overdue_topic_ids,
            has_due_revision=t['id'] in due_topic_ids
        )
        scored_topics.append({
            "topic": t,
            "score": p_info['score'],
            "reason": p_info['reason']
        })
        
    # Sort descending by priority score
    scored_topics.sort(key=lambda x: x['score'], reverse=True)
    
    total_minutes = int(available_hours * 60)
    allocated = 0
    sessions = []
    time_slots = ['09:00 - 09:50', '10:15 - 11:05', '14:00 - 14:50', '16:00 - 16:50']
    
    for idx, item in enumerate(scored_topics):
        if allocated >= total_minutes:
            break
        duration = min(50, total_minutes - allocated)
        if duration < 25:
            break
        sessions.append({
            "topic_name": item['topic']['name'],
            "subject": item['topic']['subject'],
            "time_slot": time_slots[idx % len(time_slots)],
            "scheduled_minutes": duration,
            "priority_score": item['score'],
            "reason": item['reason'],
            "status": "planned"
        })
        allocated += duration
        
    return sessions
`,
  'analytics.py': `"""
CognitivePath: Weak-Area Diagnostics & Analytics Engine
Utilizes Pandas and NumPy to identify critical gaps and generate recommendations.
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any

def analyze_weak_areas(topics: List[Dict[str, Any]], quiz_attempts: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not topics:
        return {"weak_topics": [], "average_accuracy": 0.0, "strong_topics": []}
        
    df_topics = pd.DataFrame(topics)
    
    # Calculate performance classifications
    weak_threshold = 0.60
    critical_threshold = 0.45
    
    df_topics['severity'] = np.where(
        df_topics['accuracy_rate'] < critical_threshold, 'Critical Gap',
        np.where(df_topics['accuracy_rate'] < weak_threshold, 'Needs Practice', 'Proficient')
    )
    
    weak_df = df_topics[df_topics['accuracy_rate'] < weak_threshold].sort_values(by='accuracy_rate')
    strong_df = df_topics[df_topics['accuracy_rate'] >= weak_threshold].sort_values(by='accuracy_rate', ascending=False)
    
    overall_accuracy = float(df_topics['accuracy_rate'].mean() * 100) if not df_topics.empty else 0.0
    
    return {
        "overall_accuracy_pct": round(overall_accuracy, 1),
        "weak_topics": weak_df[['id', 'name', 'subject', 'accuracy_rate', 'severity']].to_dict(orient='records'),
        "strong_topics": strong_df[['id', 'name', 'subject', 'accuracy_rate']].to_dict(orient='records'),
        "total_topics_analyzed": len(df_topics)
    }
`,
  'app.py': `"""
CognitivePath - Streamlit Web Dashboard
Run locally with: streamlit run app.py
"""
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import date, timedelta
from scheduler import generate_daily_schedule
from spaced_repetition import calculate_sm2
from analytics import analyze_weak_areas

st.set_page_config(page_title="CognitivePath", layout="wide", page_icon="🎓")

st.title("🎓 CognitivePath: AI Study Planner & Revision Platform")
st.markdown("A connected study planning, spaced repetition, diagnostic quiz, and skill roadmap platform.")

# Sidebar navigation
page = st.sidebar.radio(
    "Navigation Modules",
    ["Dashboard", "Study Planner", "Spaced Revision", "Weak Area Diagnostics", "Career Roadmap"]
)

# Sample session state initialization
if "topics" not in st.session_state:
    st.session_state.topics = [
        {"id": 1, "subject": "DSA", "name": "Dynamic Programming", "difficulty": 5, "importance": 5, "accuracy_rate": 0.42},
        {"id": 2, "subject": "DBMS", "name": "B+ Trees & Indexing", "difficulty": 4, "importance": 5, "accuracy_rate": 0.48},
        {"id": 3, "subject": "DSA", "name": "Graph Traversal (BFS/DFS)", "difficulty": 3, "importance": 4, "accuracy_rate": 0.82},
        {"id": 4, "subject": "DBMS", "name": "ACID & Transactions", "difficulty": 4, "importance": 4, "accuracy_rate": 0.76}
    ]
if "deadlines" not in st.session_state:
    st.session_state.deadlines = [
        {"subject": "DSA", "exam_date": date.today() + timedelta(days=3), "weight": 5},
        {"subject": "DBMS", "exam_date": date.today() + timedelta(days=10), "weight": 4}
    ]
if "revisions" not in st.session_state:
    st.session_state.revisions = [
        {"topic_id": 1, "topic_name": "Dynamic Programming", "due_date": date.today(), "interval_days": 3, "repetition_count": 1, "ease_factor": 2.1, "status": "due"}
    ]

if page == "Dashboard":
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Weekly Target", "16.0 hrs", "+2.5 hrs vs last week")
    col2.metric("Overall Accuracy", "62.0%", "-4% in DP")
    col3.metric("Revisions Due", "1 Due Today", "Overdue: 0")
    col4.metric("Nearest Exam", "DSA Midterm", "In 3 Days")
    
    st.subheader("Today's Adaptive Study Schedule")
    schedule = generate_daily_schedule(st.session_state.topics, st.session_state.deadlines, st.session_state.revisions, 3.5)
    st.table(pd.DataFrame(schedule))

elif page == "Spaced Revision":
    st.subheader("SuperMemo SM-2 Spaced Repetition Tracker")
    st.write("Active items scheduled for review based on memory retention intervals:")
    st.dataframe(pd.DataFrame(st.session_state.revisions))

st.sidebar.info("CognitivePath Standalone Python Platform. Powered by SQLAlchemy, Pandas & Streamlit.")
`
};
