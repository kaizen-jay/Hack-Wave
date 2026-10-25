import sqlite3
import os
import json
from datetime import datetime, date, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'learning_platform.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Students table
    c.execute('''
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role_description TEXT,
        avatar_url TEXT,
        career_goal TEXT,
        target_timeline TEXT,
        weekly_target_hours REAL DEFAULT 14.0,
        daily_available_hours REAL DEFAULT 3.0,
        current_skills TEXT,
        subjects TEXT
    )''')

    # Exam Deadlines table
    c.execute('''
    CREATE TABLE IF NOT EXISTS exam_deadlines (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        weight INTEGER DEFAULT 4,
        notes TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )''')

    # Topics table
    c.execute('''
    CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        name TEXT NOT NULL,
        difficulty INTEGER DEFAULT 3,
        importance INTEGER DEFAULT 3,
        accuracy_rate REAL DEFAULT 0.5,
        total_quiz_attempts INTEGER DEFAULT 0,
        last_studied_at TEXT,
        needs_revision INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )''')

    # Study Sessions table
    c.execute('''
    CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        session_date TEXT NOT NULL,
        time_slot TEXT,
        scheduled_minutes INTEGER DEFAULT 50,
        actual_minutes INTEGER,
        status TEXT DEFAULT 'planned',
        priority_score INTEGER DEFAULT 50,
        reason_prioritized TEXT,
        notes TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )''')

    # Spaced Repetition Items table (SM-2)
    c.execute('''
    CREATE TABLE IF NOT EXISTS revision_items (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        due_date TEXT NOT NULL,
        interval_days INTEGER DEFAULT 1,
        repetition_count INTEGER DEFAULT 0,
        ease_factor REAL DEFAULT 2.5,
        status TEXT DEFAULT 'due',
        last_reviewed_at TEXT,
        review_history TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )''')

    # Quiz Attempts table
    c.execute('''
    CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        attempt_date TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        score_percentage REAL NOT NULL,
        duration_seconds INTEGER DEFAULT 180,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )''')

    # Career Roadmaps table
    c.execute('''
    CREATE TABLE IF NOT EXISTS career_roadmaps (
        id TEXT PRIMARY KEY,
        career_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        estimated_months INTEGER,
        stages_json TEXT
    )''')

    conn.commit()

    # Check if we should seed default student
    c.execute('SELECT COUNT(*) FROM students')
    if c.fetchone()[0] == 0:
        seed_default_data(conn)

    conn.close()

def seed_default_data(conn):
    c = conn.cursor()
    today = date.today()

    # Seed Alex Rivera
    alex_skills = json.dumps([
        'Python Syntax & Basics',
        'Object-Oriented Programming',
        'Git & GitHub',
        'Arrays & Hash Maps',
        'Relational Schema Design',
        'Basic SQL Queries'
    ])
    alex_subjects = json.dumps([
        'Data Structures & Algorithms',
        'Database Management Systems',
        'Linear Algebra & Calculus',
        'Operating Systems'
    ])

    c.execute('''
    INSERT INTO students (id, name, role_description, avatar_url, career_goal, target_timeline, weekly_target_hours, daily_available_hours, current_skills, subjects)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        'student-alex',
        'Alex Rivera',
        'Computer Science Sophomore · AI/ML Track',
        '/src/assets/images/student_avatar_alex_1792909758474.jpg',
        'AI / Machine Learning Engineer',
        'Summer 2027 Tech Internship',
        16.0,
        3.5,
        alex_skills,
        alex_subjects
    ))

    # Deadlines for Alex
    c.execute('''
    INSERT INTO exam_deadlines (id, student_id, subject, exam_date, weight, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        'dl-1',
        'student-alex',
        'Data Structures & Algorithms',
        (today + timedelta(days=3)).isoformat(),
        5,
        'Midterm: Trees, Graphs, DP, Complexity Analysis'
    ))
    c.execute('''
    INSERT INTO exam_deadlines (id, student_id, subject, exam_date, weight, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        'dl-2',
        'student-alex',
        'Database Management Systems',
        (today + timedelta(days=10)).isoformat(),
        4,
        'Indexing, B+ Trees, Transactions, Normalization'
    ))
    c.execute('''
    INSERT INTO exam_deadlines (id, student_id, subject, exam_date, weight, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        'dl-3',
        'student-alex',
        'Linear Algebra & Calculus',
        (today + timedelta(days=21)).isoformat(),
        4,
        'Eigenvalues, SVD, Multivariable Gradients'
    ))

    # Topics for Alex
    topics = [
        ('top-1', 'student-alex', 'Data Structures & Algorithms', 'Dynamic Programming & Memoization', 5, 5, 0.42, 4, (today - timedelta(days=4)).isoformat(), 1, 'Recurrence relations in knapsack and LCS'),
        ('top-2', 'student-alex', 'Data Structures & Algorithms', 'Graph Traversal (BFS & DFS)', 3, 4, 0.82, 5, (today - timedelta(days=6)).isoformat(), 0, 'Adjacency lists and topological sort'),
        ('top-3', 'student-alex', 'Database Management Systems', 'B+ Trees & Database Indexing Mechanics', 4, 5, 0.48, 3, (today - timedelta(days=5)).isoformat(), 1, 'Split algorithms and clustered vs secondary indexes'),
        ('top-4', 'student-alex', 'Database Management Systems', 'ACID Properties & Transaction Isolation', 4, 4, 0.76, 4, (today - timedelta(days=2)).isoformat(), 0, 'Read committed vs Serializable locking'),
        ('top-5', 'student-alex', 'Linear Algebra & Calculus', 'Matrix Eigenvalues & Eigenvectors', 4, 5, 0.55, 2, (today - timedelta(days=7)).isoformat(), 1, 'Diagonalization and geometric PCA'),
        ('top-6', 'student-alex', 'Data Structures & Algorithms', 'Binary Search & Monotonic Predicates', 3, 4, 0.90, 6, (today - timedelta(days=1)).isoformat(), 0, 'Mastered boundary conditions')
    ]
    c.executemany('''
    INSERT INTO topics (id, student_id, subject, name, difficulty, importance, accuracy_rate, total_quiz_attempts, last_studied_at, needs_revision, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', topics)

    # Revisions for Alex
    rev_history_1 = json.dumps([
        {'date': (today - timedelta(days=6)).isoformat(), 'rating': 2, 'intervalDays': 1},
        {'date': (today - timedelta(days=3)).isoformat(), 'rating': 2, 'intervalDays': 3}
    ])
    rev_history_2 = json.dumps([
        {'date': (today - timedelta(days=6)).isoformat(), 'rating': 2, 'intervalDays': 2}
    ])
    rev_history_3 = json.dumps([
        {'date': (today - timedelta(days=12)).isoformat(), 'rating': 3, 'intervalDays': 3},
        {'date': (today - timedelta(days=5)).isoformat(), 'rating': 3, 'intervalDays': 7}
    ])

    revisions = [
        ('rev-1', 'student-alex', 'top-1', 'Dynamic Programming & Memoization', 'Data Structures & Algorithms', today.isoformat(), 3, 1, 2.1, 'due', (today - timedelta(days=3)).isoformat(), rev_history_1),
        ('rev-2', 'student-alex', 'top-3', 'B+ Trees & Database Indexing Mechanics', 'Database Management Systems', (today - timedelta(days=2)).isoformat(), 4, 1, 2.3, 'overdue', (today - timedelta(days=6)).isoformat(), rev_history_2),
        ('rev-3', 'student-alex', 'top-4', 'ACID Properties & Transaction Isolation', 'Database Management Systems', (today + timedelta(days=2)).isoformat(), 7, 2, 2.5, 'upcoming', (today - timedelta(days=5)).isoformat(), rev_history_3),
        ('rev-4', 'student-alex', 'top-6', 'Binary Search & Monotonic Predicates', 'Data Structures & Algorithms', (today + timedelta(days=18)).isoformat(), 21, 4, 2.7, 'mastered', (today - timedelta(days=3)).isoformat(), '[]')
    ]
    c.executemany('''
    INSERT INTO revision_items (id, student_id, topic_id, topic_name, subject, due_date, interval_days, repetition_count, ease_factor, status, last_reviewed_at, review_history)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', revisions)

    # Sessions for today
    sessions = [
        ('sess-1', 'student-alex', 'top-1', 'Dynamic Programming & Memoization', 'Data Structures & Algorithms', today.isoformat(), '09:00 - 09:50', 50, None, 'planned', 92, 'Exam in 3d · Weak accuracy (42%) · Revision Due Today', 'Focus on 0/1 knapsack state table'),
        ('sess-2', 'student-alex', 'top-3', 'B+ Trees & Database Indexing Mechanics', 'Database Management Systems', today.isoformat(), '10:15 - 11:05', 50, None, 'planned', 78, 'Exam next week (10d away) · Weak accuracy (48%) · Overdue Spaced Revision', 'Review node split logic'),
        ('sess-3', 'student-alex', 'top-5', 'Matrix Eigenvalues & Eigenvectors', 'Linear Algebra & Calculus', today.isoformat(), '14:00 - 14:50', 50, None, 'planned', 54, 'Exam in 21d · Accuracy: 55% · Standard review', 'Practice characteristic polynomial roots')
    ]
    c.executemany('''
    INSERT INTO study_sessions (id, student_id, topic_id, topic_name, subject, session_date, time_slot, scheduled_minutes, actual_minutes, status, priority_score, reason_prioritized, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sessions)

    # Quiz attempts
    quiz_attempts = [
        ('qa-1', 'student-alex', 'top-1', 'Dynamic Programming & Memoization', 'Data Structures & Algorithms', (today - timedelta(days=2)).isoformat(), 5, 2, 40.0, 340),
        ('qa-2', 'student-alex', 'top-3', 'B+ Trees & Database Indexing Mechanics', 'Database Management Systems', (today - timedelta(days=4)).isoformat(), 5, 2, 40.0, 290),
        ('qa-3', 'student-alex', 'top-4', 'ACID Properties & Transaction Isolation', 'Database Management Systems', (today - timedelta(days=5)).isoformat(), 4, 3, 75.0, 210),
        ('qa-4', 'student-alex', 'top-2', 'Graph Traversal (BFS & DFS)', 'Data Structures & Algorithms', (today - timedelta(days=8)).isoformat(), 5, 4, 80.0, 310)
    ]
    c.executemany('''
    INSERT INTO quiz_attempts (id, student_id, topic_id, topic_name, subject, attempt_date, total_questions, correct_count, score_percentage, duration_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', quiz_attempts)

    conn.commit()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at", DB_PATH)
