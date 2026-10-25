import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  Topic,
  ExamDeadline,
  StudySession,
  RevisionItem,
  QuizAttempt,
  SkillStatus
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TOPICS,
  INITIAL_REVISIONS,
  INITIAL_SESSIONS,
  INITIAL_QUIZ_ATTEMPTS
} from './data/mockData';
import { generateAdaptiveDailySchedule } from './utils/algorithms';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { RevisionTrackerView } from './components/RevisionTrackerView';
import { WeakAreaDiagnosticsView } from './components/WeakAreaDiagnosticsView';
import { CareerRoadmapsView } from './components/CareerRoadmapsView';
import { PythonArchitectureView } from './components/PythonArchitectureView';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Multi-student profiles
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('cp_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem('cp_active_student_id') || 'student-alex';
  });

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // Topics
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('cp_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  // Revisions
  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem('cp_revisions');
    return saved ? JSON.parse(saved) : INITIAL_REVISIONS;
  });

  // Sessions
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('cp_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  // Quiz Attempts
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('cp_quiz_attempts');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_ATTEMPTS;
  });

  // Navigation target topic for quiz
  const [quizTargetTopicId, setQuizTargetTopicId] = useState<string | null>(null);

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('cp_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cp_active_student_id', activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem('cp_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('cp_revisions', JSON.stringify(revisions));
  }, [revisions]);

  useEffect(() => {
    localStorage.setItem('cp_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('cp_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Optional sync with Python backend
  useEffect(() => {
    async function syncFromPythonBackend() {
      try {
        const res = await fetch('/api/schedule');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Backend is active and responded with Python sessions
            console.log('Python SQLite backend connected:', data.length, 'sessions');
          }
        }
      } catch (e) {
        // Fallback to local state silently
      }
    }
    syncFromPythonBackend();
  }, []);

  // Update session status
  const handleUpdateSessionStatus = async (
    sessionId: string,
    status: 'completed' | 'skipped' | 'rescheduled',
    actualMinutes?: number
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status,
          actualMinutes: actualMinutes || s.scheduledMinutes
        };
      })
    );

    // Sync with Python backend if available
    try {
      await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          status,
          actual_minutes: actualMinutes
        })
      });
    } catch (e) {
      // Handled in memory
    }
  };

  // Add custom session
  const handleAddSession = (newSession: StudySession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  // Add exam deadline
  const handleAddDeadline = (newDeadline: ExamDeadline) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== activeStudent.id) return s;
        return {
          ...s,
          examDeadlines: [...s.examDeadlines, newDeadline]
        };
      })
    );
  };

  // Regenerate adaptive study plan
  const handleRegenerateSchedule = async (hours: number) => {
    // Attempt through Python backend first
    try {
      const res = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_hours: hours })
      });
      if (res.ok) {
        const pySessions = await res.json();
        if (Array.isArray(pySessions) && pySessions.length > 0) {
          const mapped: StudySession[] = pySessions.map((ps: any) => ({
            id: ps.id,
            topicId: ps.topic_id,
            topicName: ps.topic_name,
            subject: ps.subject,
            date: ps.session_date,
            timeSlot: ps.time_slot,
            scheduledMinutes: ps.scheduled_minutes,
            status: ps.status,
            priorityScore: ps.priority_score,
            reasonPrioritized: ps.reason_prioritized,
            notes: ps.notes
          }));
          setSessions(mapped);
          return;
        }
      }
    } catch (e) {
      console.warn('Using client algorithm fallback');
    }

    // Client algorithm fallback
    const newSessions = generateAdaptiveDailySchedule(
      topics,
      activeStudent.examDeadlines,
      revisions,
      hours
    );
    setSessions(newSessions);
  };

  // Update revision item (after SM-2 review)
  const handleUpdateRevision = async (updatedItem: RevisionItem) => {
    setRevisions((prev) =>
      prev.map((r) => (r.id === updatedItem.id ? updatedItem : r))
    );

    // Call Python backend
    try {
      const lastReview = updatedItem.reviewHistory[updatedItem.reviewHistory.length - 1];
      await fetch('/api/revisions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revision_id: updatedItem.id,
          rating: lastReview?.rating || 3
        })
      });
    } catch (e) {
      // Local state preserved
    }
  };

  // Add topic to revision tracking
  const handleAddRevision = (newItem: RevisionItem) => {
    setRevisions((prev) => [...prev, newItem]);
  };

  // Diagnostic Quiz completed
  const handleQuizCompleted = async (
    topicId: string,
    correctCount: number,
    totalQuestions: number,
    durationSeconds: number
  ) => {
    const accuracy = correctCount / totalQuestions;
    const scorePct = Math.round(accuracy * 100);

    // Update topic accuracy rate with exponential moving average
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newAcc = parseFloat(((t.accuracyRate * 0.4) + (accuracy * 0.6)).toFixed(2));
        return {
          ...t,
          accuracyRate: newAcc,
          totalQuizAttempts: t.totalQuizAttempts + 1,
          needsRevision: newAcc < 0.6
        };
      })
    );

    // Add Quiz Attempt record
    const targetTopic = topics.find((t) => t.id === topicId);
    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now()}`,
      topicId,
      topicName: targetTopic?.name || 'Topic',
      subject: targetTopic?.subject || 'Subject',
      date: new Date().toISOString().split('T')[0],
      totalQuestions,
      correctCount,
      scorePercentage: scorePct,
      durationSeconds
    };
    setQuizAttempts((prev) => [newAttempt, ...prev]);

    // Send to Python backend to update SQLite database
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topicId,
          total_questions: totalQuestions,
          correct_count: correctCount,
          score_percentage: scorePct,
          duration_seconds: durationSeconds
        })
      });
    } catch (e) {
      // Local state persisted
    }
  };

  // Schedule remedial study session directly from weak area quiz
  const handleScheduleRemediation = (topic: Topic) => {
    const remedialSession: StudySession = {
      id: `remedial-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      subject: topic.subject,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'High Priority Remediation',
      scheduledMinutes: 45,
      status: 'planned',
      priorityScore: 95,
      reasonPrioritized: `Targeted practice for ${Math.round(topic.accuracyRate * 100)}% accuracy gap`,
      notes: 'Focus on identified misconception questions from recent diagnostic quiz.'
    };
    setSessions((prev) => [remedialSession, ...prev]);
    setCurrentTab('planner');
  };

  // Reset to initial demo dataset
  const handleResetData = async () => {
    localStorage.removeItem('cp_students');
    localStorage.removeItem('cp_topics');
    localStorage.removeItem('cp_revisions');
    localStorage.removeItem('cp_sessions');
    localStorage.removeItem('cp_quiz_attempts');

    setStudents(INITIAL_STUDENTS);
    setActiveStudentId('student-alex');
    setTopics(INITIAL_TOPICS);
    setRevisions(INITIAL_REVISIONS);
    setSessions(INITIAL_SESSIONS);
    setQuizAttempts(INITIAL_QUIZ_ATTEMPTS);

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      // Local reset complete
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#ede7e1] flex flex-col font-sans selection:bg-[#e28766]/30 selection:text-[#fdf8f5]">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setQuizTargetTopicId(null);
        }}
        student={activeStudent}
        students={students}
        onSelectStudent={(s) => setActiveStudentId(s.id)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            student={activeStudent}
            topics={topics}
            deadlines={activeStudent.examDeadlines}
            sessions={sessions}
            revisions={revisions}
            quizAttempts={quizAttempts}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onUpdateSessionStatus={(id, status) => handleUpdateSessionStatus(id, status)}
            onStartQuizForTopic={(topicId) => {
              setQuizTargetTopicId(topicId);
              setCurrentTab('diagnostics');
            }}
            onStartRevisionReview={(rev) => {
              setCurrentTab('revision');
            }}
            onRefreshAdaptivePlan={() => handleRegenerateSchedule(activeStudent.dailyAvailableHours)}
          />
        )}

        {currentTab === 'planner' && (
          <StudyPlannerView
            student={activeStudent}
            topics={topics}
            deadlines={activeStudent.examDeadlines}
            sessions={sessions}
            revisions={revisions}
            onUpdateSessionStatus={handleUpdateSessionStatus}
            onAddSession={handleAddSession}
            onAddDeadline={handleAddDeadline}
            onRegenerateSchedule={handleRegenerateSchedule}
          />
        )}

        {currentTab === 'revision' && (
          <RevisionTrackerView
            student={activeStudent}
            topics={topics}
            revisions={revisions}
            onUpdateRevision={handleUpdateRevision}
            onAddRevision={handleAddRevision}
          />
        )}

        {currentTab === 'diagnostics' && (
          <WeakAreaDiagnosticsView
            student={activeStudent}
            topics={topics}
            quizAttempts={quizAttempts}
            selectedTopicForQuiz={quizTargetTopicId}
            onQuizCompleted={handleQuizCompleted}
            onScheduleRemediationSession={handleScheduleRemediation}
          />
        )}

        {currentTab === 'roadmaps' && (
          <CareerRoadmapsView
            student={activeStudent}
            onUpdateSkillStatus={(skillId, status) => {
              // Update student skills if completed
              if (status === 'completed') {
                // Find skill name
                // update student
              }
            }}
          />
        )}

        {currentTab === 'python-code' && (
          <PythonArchitectureView />
        )}
      </main>

      {/* Profile & Settings Modal */}
      <ProfileModal
        student={activeStudent}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={(updated) => {
          setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        }}
      />
    </div>
  );
}
