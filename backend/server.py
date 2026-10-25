"""
Python REST API Server for CognitivePath
Powered by SQLite3, SM-2 Spaced Repetition, and Gemini API.
Runs on port 5001.
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

    def do_OPTIONS(self):
        self._set_headers(204)

    def _read_json(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        conn = get_connection()
        c = conn.cursor()

        try:
            if path == '/api/health':
                self._set_headers(200)
                self.wfile.write(json.dumps({'status': 'ok', 'engine': 'python3_sqlite'}).encode('utf-8'))

            elif path == '/api/student':
                c.execute('SELECT * FROM students LIMIT 1')
                row = c.fetchone()
                if not row:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({'error': 'Student not found'}).encode('utf-8'))
                    return

                student = dict(row)
                student['current_skills'] = json.loads(student.get('current_skills') or '[]')
                student['subjects'] = json.loads(student.get('subjects') or '[]')

                c.execute('SELECT * FROM exam_deadlines WHERE student_id = ? ORDER BY exam_date ASC', (student['id'],))
                deadlines = [dict(r) for r in c.fetchall()]
                student['exam_deadlines'] = deadlines

                self._set_headers(200)
                self.wfile.write(json.dumps(student).encode('utf-8'))

            elif path == '/api/topics':
                c.execute('SELECT * FROM topics ORDER BY accuracy_rate ASC')
                topics = [dict(r) for r in c.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps(topics).encode('utf-8'))

            elif path == '/api/deadlines':
                c.execute('SELECT * FROM exam_deadlines ORDER BY exam_date ASC')
                deadlines = [dict(r) for r in c.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps(deadlines).encode('utf-8'))

            elif path == '/api/schedule':
                today_str = date.today().isoformat()
                c.execute('SELECT * FROM study_sessions WHERE session_date = ? ORDER BY priority_score DESC', (today_str,))
                sessions = [dict(r) for r in c.fetchall()]
                if not sessions:
                    # Fetch all sessions
                    c.execute('SELECT * FROM study_sessions ORDER BY priority_score DESC LIMIT 10')
                    sessions = [dict(r) for r in c.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps(sessions).encode('utf-8'))

            elif path == '/api/revisions':
                c.execute('SELECT * FROM revision_items ORDER BY due_date ASC')
                rows = c.fetchall()
                revisions = []
                for r in rows:
                    item = dict(r)
                    item['review_history'] = json.loads(item.get('review_history') or '[]')
                    revisions.append(item)
                self._set_headers(200)
                self.wfile.write(json.dumps(revisions).encode('utf-8'))

            elif path == '/api/analytics':
                c.execute('SELECT * FROM topics')
                topics = [dict(r) for r in c.fetchall()]
                c.execute('SELECT * FROM quiz_attempts')
                attempts = [dict(r) for r in c.fetchall()]
                analysis = analyze_weaknesses(topics, attempts)
                self._set_headers(200)
                self.wfile.write(json.dumps(analysis).encode('utf-8'))

            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Not found'}).encode('utf-8'))

        finally:
            conn.close()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        body = self._read_json()

        conn = get_connection()
        c = conn.cursor()

        try:
            if path == '/api/schedule/generate':
                # Fetch student
                c.execute('SELECT * FROM students LIMIT 1')
                student = dict(c.fetchone())
                available_hours = float(body.get('available_hours') or student.get('daily_available_hours') or 3.5)

                c.execute('SELECT * FROM topics')
                topics = [dict(r) for r in c.fetchall()]
                c.execute('SELECT * FROM exam_deadlines')
                deadlines = [dict(r) for r in c.fetchall()]
                c.execute('SELECT * FROM revision_items')
                revisions = [dict(r) for r in c.fetchall()]

                new_sessions = generate_daily_schedule(
                    student['id'], topics, deadlines, revisions, available_hours
                )

                today_str = date.today().isoformat()
                c.execute('DELETE FROM study_sessions WHERE session_date = ? AND status = "planned"', (today_str,))
                for s in new_sessions:
                    c.execute('''
                    INSERT INTO study_sessions (id, student_id, topic_id, topic_name, subject, session_date, time_slot, scheduled_minutes, actual_minutes, status, priority_score, reason_prioritized, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        s['id'], s['student_id'], s['topic_id'], s['topic_name'], s['subject'],
                        s['session_date'], s['time_slot'], s['scheduled_minutes'], s['actual_minutes'],
                        s['status'], s['priority_score'], s['reason_prioritized'], s['notes']
                    ))
                conn.commit()

                self._set_headers(200)
                self.wfile.write(json.dumps(new_sessions).encode('utf-8'))

            elif path == '/api/session/update':
                session_id = body.get('session_id')
                status = body.get('status')
                actual_minutes = body.get('actual_minutes')

                if actual_minutes is not None:
                    c.execute('UPDATE study_sessions SET status = ?, actual_minutes = ? WHERE id = ?', (status, actual_minutes, session_id))
                else:
                    c.execute('UPDATE study_sessions SET status = ? WHERE id = ?', (status, session_id))
                conn.commit()

                self._set_headers(200)
                self.wfile.write(json.dumps({'success': True, 'session_id': session_id, 'status': status}).encode('utf-8'))

            elif path == '/api/revisions/review':
                revision_id = body.get('revision_id')
                rating = int(body.get('rating', 3))

                c.execute('SELECT * FROM revision_items WHERE id = ?', (revision_id,))
                row = c.fetchone()
                if not row:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({'error': 'Revision item not found'}).encode('utf-8'))
                    return

                item = dict(row)
                result = calculate_sm2_review(
                    item['repetition_count'],
                    item['interval_days'],
                    item['ease_factor'],
                    rating
                )

                history = json.loads(item.get('review_history') or '[]')
                history.append({
                    'date': date.today().isoformat(),
                    'rating': rating,
                    'interval_days': result['interval_days']
                })

                new_status = 'mastered' if result['interval_days'] >= 21 else 'upcoming'

                c.execute('''
                UPDATE revision_items
                SET interval_days = ?, repetition_count = ?, ease_factor = ?, due_date = ?, status = ?, last_reviewed_at = ?, review_history = ?
                WHERE id = ?
                ''', (
                    result['interval_days'],
                    result['repetition_count'],
                    result['ease_factor'],
                    result['due_date'],
                    new_status,
                    date.today().isoformat(),
                    json.dumps(history),
                    revision_id
                ))
                conn.commit()

                self._set_headers(200)
                self.wfile.write(json.dumps({
                    'success': True,
                    'updated': {
                        'id': revision_id,
                        **result,
                        'status': new_status
                    }
                }).encode('utf-8'))

            elif path == '/api/quiz/submit':
                topic_id = body.get('topic_id')
                total_q = int(body.get('total_questions', 1))
                correct_q = int(body.get('correct_count', 0))
                score_pct = float(body.get('score_percentage', (correct_q / total_q) * 100))

                c.execute('SELECT * FROM topics WHERE id = ?', (topic_id,))
                topic_row = c.fetchone()
                if topic_row:
                    t = dict(topic_row)
                    attempts = t['total_quiz_attempts'] + 1
                    # Exponential moving average accuracy update
                    new_acc = round((t['accuracy_rate'] * 0.4) + ((correct_q / total_q) * 0.6), 2)
                    c.execute('UPDATE topics SET accuracy_rate = ?, total_quiz_attempts = ? WHERE id = ?', (new_acc, attempts, topic_id))

                    # Log attempt
                    qa_id = f"qa-{int(datetime.utcnow().timestamp())}"
                    c.execute('''
                    INSERT INTO quiz_attempts (id, student_id, topic_id, topic_name, subject, attempt_date, total_questions, correct_count, score_percentage, duration_seconds)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        qa_id, t['student_id'], topic_id, t['name'], t['subject'],
                        date.today().isoformat(), total_q, correct_q, score_pct, body.get('duration_seconds', 120)
                    ))
                    conn.commit()

                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        'success': True,
                        'new_accuracy_rate': new_acc,
                        'total_quiz_attempts': attempts
                    }).encode('utf-8'))
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({'error': 'Topic not found'}).encode('utf-8'))

            elif path == '/api/ai/recommend':
                c.execute('SELECT * FROM students LIMIT 1')
                student = dict(c.fetchone())
                c.execute('SELECT * FROM topics WHERE accuracy_rate < 0.6 ORDER BY accuracy_rate ASC')
                weaks = [dict(r) for r in c.fetchall()]
                c.execute('SELECT * FROM exam_deadlines ORDER BY exam_date ASC LIMIT 3')
                dls = [dict(r) for r in c.fetchall()]

                recommendation = get_study_recommendation(student, weaks, dls)
                self._set_headers(200)
                self.wfile.write(json.dumps(recommendation).encode('utf-8'))

            elif path == '/api/ai/quiz':
                topic_name = body.get('topic', 'Data Structures')
                diff = body.get('difficulty', 'Medium')
                questions = generate_quiz(topic_name, diff, count=3)
                self._set_headers(200)
                self.wfile.write(json.dumps({'questions': questions}).encode('utf-8'))

            elif path == '/api/reset':
                c.execute('DELETE FROM students')
                c.execute('DELETE FROM exam_deadlines')
                c.execute('DELETE FROM topics')
                c.execute('DELETE FROM study_sessions')
                c.execute('DELETE FROM revision_items')
                c.execute('DELETE FROM quiz_attempts')
                conn.commit()
                seed_default_data(conn)
                self._set_headers(200)
                self.wfile.write(json.dumps({'status': 'reset_complete'}).encode('utf-8'))

            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Unknown endpoint'}).encode('utf-8'))

        finally:
            conn.close()

def run(server_class=HTTPServer, handler_class=CognitivePathHandler):
    init_db()
    server_address = ('127.0.0.1', PORT)
    httpd = server_class(server_address, handler_class)
    print(f"CognitivePath Python API Server running on http://127.0.0.1:{PORT}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
