import React, { useState } from 'react';
import {
  StudentProfile,
  Topic,
  ExamDeadline,
  StudySession,
  RevisionItem,
  QuizAttempt
} from '../types';
import {
  Clock,
  TrendingUp,
  Brain,
  Calendar,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCw,
  Compass,
  FileCode,
  Flame
} from 'lucide-react';

interface DashboardViewProps {
  student: StudentProfile;
  topics: Topic[];
  deadlines: ExamDeadline[];
  sessions: StudySession[];
  revisions: RevisionItem[];
  quizAttempts: QuizAttempt[];
  onNavigateTab: (tab: string) => void;
  onUpdateSessionStatus: (sessionId: string, status: 'completed' | 'skipped' | 'rescheduled') => void;
  onStartQuizForTopic: (topicId: string) => void;
  onStartRevisionReview: (revision: RevisionItem) => void;
  onRefreshAdaptivePlan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  topics,
  deadlines,
  sessions,
  revisions,
  quizAttempts,
  onNavigateTab,
  onUpdateSessionStatus,
  onStartQuizForTopic,
  onStartRevisionReview,
  onRefreshAdaptivePlan
}) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const completedMinutesToday = todaySessions
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + (s.actualMinutes || s.scheduledMinutes), 0);
  const totalCompletedHours = (completedMinutesToday / 60).toFixed(1);

  // Deadlines
  const sortedDeadlines = [...deadlines]
    .map((d) => {
      const diffTime = new Date(d.date).getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...d, diffDays };
    })
    .filter((d) => d.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays);
  const nearestExam = sortedDeadlines[0];

  // Revisions
  const dueRevisions = revisions.filter((r) => r.status === 'due' || r.status === 'overdue');
  const overdueCount = revisions.filter((r) => r.status === 'overdue').length;

  // Weak topics
  const weakTopics = topics
    .filter((t) => t.accuracyRate < 0.6)
    .sort((a, b) => a.accuracyRate - b.accuracyRate);

  const avgAccuracy = topics.length
    ? Math.round((topics.reduce((acc, t) => acc + t.accuracyRate, 0) / topics.length) * 100)
    : 0;

  const handleFetchAiRecommendation = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          weakTopics,
          upcomingDeadlines: sortedDeadlines.slice(0, 3)
        })
      });
      const data = await res.json();
      if (data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      setAiAdvice(
        `Dedicate your morning study blocks to active problem-solving in ${weakTopics[0]?.name || 'key concepts'}. With the ${nearestExam?.subject || 'upcoming assessment'} in ${nearestExam?.diffDays || 3} days, replace passive reading with self-testing.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Editorial Mountain Atmosphere Hero Window */}
      <div className="relative rounded-3xl overflow-hidden border border-[#2b3144] shadow-2xl bg-[#0d1017]">
        <div className="h-64 sm:h-72 w-full overflow-hidden relative">
          <img
            src="/public/assets/aistudio/image_beca4a12.png"
            alt="Alpenglow Mountain Sunset"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/50 to-transparent" />
          <div className="absolute inset-0 bg-[#c86d51]/10 mix-blend-overlay" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#f6c492] uppercase">
              <span>{student.roleDescription}</span>
              <span aria-hidden="true">·</span>
              <span>{student.targetGraduationOrInternship}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fdf8f5] leading-tight">
              Welcome back, {student.name.split(' ')[0]}.
            </h1>
            <p className="text-sm text-[#e2ded9] leading-relaxed max-w-xl font-light">
              Your curriculum is calibrated around the <strong className="text-white font-medium">{nearestExam?.subject}</strong> examination in <strong className="text-[#f6c492] font-semibold">{nearestExam?.diffDays} days</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-5 py-2.5 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20 flex items-center gap-2"
            >
              <span>Open Study Window</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quiet Tabular Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs text-[#8c94a4] font-medium">Daily Study Hours</span>
          <div className="my-2">
            <span className="text-3xl font-serif text-[#fdf8f5] tabular-nums">{totalCompletedHours}</span>
            <span className="text-xs text-[#8c94a4] ml-1.5 font-sans">/ {student.dailyAvailableHours} hrs</span>
          </div>
          <div className="w-full bg-[#1b2030] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#e28766] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (parseFloat(totalCompletedHours) / student.dailyAvailableHours) * 100)}%`
              }}
            />
          </div>
        </div>

        <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs text-[#8c94a4] font-medium">Diagnostic Accuracy</span>
          <div className="my-2">
            <span className="text-3xl font-serif text-[#fdf8f5] tabular-nums">{avgAccuracy}%</span>
            <span className="text-xs text-[#8c94a4] ml-2 font-sans font-light">average</span>
          </div>
          <span className="text-[11px] text-[#8c94a4]">{quizAttempts.length} assessments completed</span>
        </div>

        <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs text-[#8c94a4] font-medium">Spaced Revisions</span>
          <div className="my-2">
            <span className="text-3xl font-serif text-[#fdf8f5] tabular-nums">{dueRevisions.length}</span>
            <span className="text-xs text-[#8c94a4] ml-1.5 font-sans font-light">due today</span>
          </div>
          <span className={`text-[11px] font-medium ${overdueCount > 0 ? 'text-[#e28766]' : 'text-[#8c94a4]'}`}>
            {overdueCount > 0 ? `${overdueCount} overdue cards` : 'All retention cards on track'}
          </span>
        </div>

        <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs text-[#8c94a4] font-medium">Next Deadline</span>
          <div className="my-2">
            <span className="text-3xl font-serif text-[#f6c492] tabular-nums">{nearestExam?.diffDays || '–'}</span>
            <span className="text-xs text-[#8c94a4] ml-1.5 font-sans font-light">days</span>
          </div>
          <span className="text-[11px] text-[#c7cbd4] truncate">{nearestExam?.subject}</span>
        </div>
      </div>

      {/* Un-Clustered Functional Windows (Spacious Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Window: Today's Focused Agenda (7 cols) */}
        <div className="lg:col-span-7 bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#232838] pb-4">
            <div>
              <h2 className="text-2xl font-serif text-[#fdf8f5]">
                Today's Study Schedule
              </h2>
              <p className="text-xs text-[#8c94a4] mt-0.5 font-light">
                Mathematically ordered by upcoming deadlines and quiz accuracy.
              </p>
            </div>
            <button
              onClick={onRefreshAdaptivePlan}
              className="text-xs text-[#f4a261] hover:text-[#f6c492] flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Re-balance</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {todaySessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8c94a4]">
                No study blocks scheduled for today. Click "Re-balance" to generate your adaptive plan.
              </div>
            ) : (
              todaySessions.map((session) => {
                const isDone = session.status === 'completed';

                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-[#0f131c]/50 border-[#232838]/60 opacity-60'
                        : 'bg-[#181d2a] border-[#2b3144] hover:border-[#384157]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[#f6c492] text-[11px]">{session.timeSlot || 'Flexible'}</span>
                        <span className="text-[#525a6c]">·</span>
                        <span className="text-[#8c94a4] truncate">{session.subject}</span>
                        <span className="text-[#525a6c]">·</span>
                        <span className="text-[#8c94a4] font-mono text-[11px]">{session.scheduledMinutes}m</span>
                      </div>
                      <h3 className={`text-base font-serif text-[#fdf8f5] truncate ${isDone ? 'line-through text-[#8c94a4]' : ''}`}>
                        {session.topicName}
                      </h3>
                      <p className="text-[11px] text-[#8c94a4] font-light truncate">
                        {session.reasonPrioritized}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {!isDone ? (
                        <button
                          onClick={() => onUpdateSessionStatus(session.id, 'completed')}
                          className="px-3.5 py-1.5 rounded-lg bg-[#e28766]/15 text-[#f4a261] hover:bg-[#e28766]/25 border border-[#e28766]/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#f6c492]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Done</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Windows: AI Advisor & Quick Launchers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Advisor Note Window */}
          <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <div className="flex items-center gap-2 text-xs font-sans tracking-wider text-[#f6c492] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mentor Field Note (Gemini 3.8)</span>
              </div>
              <button
                onClick={handleFetchAiRecommendation}
                disabled={loadingAi}
                className="text-xs text-[#8c94a4] hover:text-[#fdf8f5] flex items-center gap-1 transition-colors"
              >
                <RotateCw className={`w-3 h-3 ${loadingAi ? 'animate-spin' : ''}`} />
                <span>{loadingAi ? 'Reflecting...' : 'Refresh'}</span>
              </button>
            </div>

            <p className="text-sm font-serif italic text-[#e2ded9] leading-relaxed">
              "{aiAdvice ||
                `Given your upcoming examination in ${nearestExam?.subject || 'Data Structures'} (in ${nearestExam?.diffDays || 3} days) and accuracy of 42% in Dynamic Programming, replace passive review with focused active recall problem sets. Dedicate your first two blocks to recurrence tables.`}"
            </p>

            <div className="text-[11px] text-[#8c94a4] pt-2 border-t border-[#1e2333] flex justify-between">
              <span>Alpine Heuristic & Gemini Core</span>
              <span className="text-[#f6c492] font-mono">Live</span>
            </div>
          </div>

          {/* Dedicated Function Windows Portals */}
          <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-3.5">
            <h2 className="text-xl font-serif text-[#fdf8f5] border-b border-[#232838] pb-3">
              Specialized Study Windows
            </h2>

            {/* Portal 1: Spaced Repetition Salon */}
            <button
              onClick={() => onNavigateTab('revision')}
              className="w-full text-left p-3.5 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] border border-[#2b3144] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c86d51]/15 text-[#e28766] flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#fdf8f5] group-hover:text-[#f4a261] transition-colors">
                    Spaced Repetition Salon (SM-2)
                  </div>
                  <div className="text-[11px] text-[#8c94a4]">
                    {dueRevisions.length} cards scheduled for memory review
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8c94a4] group-hover:text-[#fdf8f5] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Portal 2: Diagnostic Assessment */}
            <button
              onClick={() => onNavigateTab('diagnostics')}
              className="w-full text-left p-3.5 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] border border-[#2b3144] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4a261]/15 text-[#f4a261] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#fdf8f5] group-hover:text-[#f4a261] transition-colors">
                    Weak-Area Diagnostics & Quizzing
                  </div>
                  <div className="text-[11px] text-[#8c94a4]">
                    {weakTopics.length} detected areas for remediation
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8c94a4] group-hover:text-[#fdf8f5] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Portal 3: Skill Roadmap */}
            <button
              onClick={() => onNavigateTab('roadmaps')}
              className="w-full text-left p-3.5 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] border border-[#2b3144] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8c94a4]/15 text-[#ede7e1] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#fdf8f5] group-hover:text-[#f4a261] transition-colors">
                    Career Skill Roadmaps
                  </div>
                  <div className="text-[11px] text-[#8c94a4]">
                    {student.careerGoal} milestone graph
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8c94a4] group-hover:text-[#fdf8f5] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Portal 4: Python Architecture */}
            <button
              onClick={() => onNavigateTab('python-code')}
              className="w-full text-left p-3.5 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] border border-[#2b3144] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#e28766]/15 text-[#f6c492] flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#fdf8f5] group-hover:text-[#f4a261] transition-colors">
                    Python Engine & Courseware
                  </div>
                  <div className="text-[11px] text-[#8c94a4]">
                    SQLite schema, SM-2 code, and local scripts
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8c94a4] group-hover:text-[#fdf8f5] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
