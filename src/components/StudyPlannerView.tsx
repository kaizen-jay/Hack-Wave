import React, { useState } from 'react';
import {
  StudentProfile,
  Topic,
  ExamDeadline,
  StudySession,
  RevisionItem
} from '../types';
import {
  Clock,
  Plus,
  Sliders,
  CheckCircle2,
  CalendarDays,
  Check,
  RotateCcw
} from 'lucide-react';

interface StudyPlannerViewProps {
  student: StudentProfile;
  topics: Topic[];
  deadlines: ExamDeadline[];
  sessions: StudySession[];
  revisions: RevisionItem[];
  onUpdateSessionStatus: (sessionId: string, status: 'completed' | 'skipped' | 'rescheduled', actualMinutes?: number) => void;
  onAddSession: (session: StudySession) => void;
  onAddDeadline: (deadline: ExamDeadline) => void;
  onRegenerateSchedule: (hours: number) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  student,
  topics,
  deadlines,
  sessions,
  revisions,
  onUpdateSessionStatus,
  onAddSession,
  onAddDeadline,
  onRegenerateSchedule
}) => {
  const [selectedHours, setSelectedHours] = useState<number>(student.dailyAvailableHours);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'planned' | 'completed' | 'rescheduled'>('all');

  const [newTopicId, setNewTopicId] = useState(topics[0]?.id || '');
  const [newDuration, setNewDuration] = useState(45);
  const [newNotes, setNewNotes] = useState('');

  const [newSubject, setNewSubject] = useState(student.subjects[0] || '');
  const [newDate, setNewDate] = useState('');
  const [newWeight, setNewWeight] = useState(4);
  const [newDeadlineNotes, setNewDeadlineNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSessions = sessions.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.status === activeFilter;
  });

  const totalScheduledMinutes = sessions.reduce((acc, s) => acc + s.scheduledMinutes, 0);
  const totalCompletedMinutes = sessions
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + (s.actualMinutes || s.scheduledMinutes), 0);
  const completionRate = totalScheduledMinutes > 0
    ? Math.round((totalCompletedMinutes / totalScheduledMinutes) * 100)
    : 0;

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = topics.find((t) => t.id === newTopicId);
    if (!topic) return;

    const newSession: StudySession = {
      id: `manual-sess-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      subject: topic.subject,
      date: todayStr,
      timeSlot: 'Flexible',
      scheduledMinutes: newDuration,
      status: 'planned',
      priorityScore: 70,
      reasonPrioritized: 'Manually scheduled by student',
      notes: newNotes
    };

    onAddSession(newSession);
    setShowAddSessionModal(false);
    setNewNotes('');
  };

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    const dl: ExamDeadline = {
      id: `dl-${Date.now()}`,
      subject: newSubject,
      date: newDate,
      weight: newWeight,
      notes: newDeadlineNotes
    };

    onAddDeadline(dl);
    setShowAddDeadlineModal(false);
    setNewDate('');
    setNewDeadlineNotes('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Window Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232838] pb-6">
        <div>
          <div className="text-xs font-sans tracking-widest text-[#f6c492] uppercase mb-1">
            Adaptive Time Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#fdf8f5]">
            Personalized Study Planner
          </h1>
          <p className="text-xs text-[#8c94a4] font-light max-w-xl mt-1 leading-relaxed">
            Packs your study day into focused 45-50 minute blocks calculated from upcoming exam proximity, diagnostic accuracy, and topic complexity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddDeadlineModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] text-[#ede7e1] border border-[#2b3144] text-xs font-medium transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#f6c492]" />
            <span>Add Exam Date</span>
          </button>
          <button
            onClick={() => setShowAddSessionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Session</span>
          </button>
        </div>
      </div>

      {/* Un-Clustered Hours Adjustment Control Bar */}
      <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-sm font-medium text-[#fdf8f5]">Daily Study Commitment</div>
          <div className="text-xs text-[#8c94a4] font-light">
            Current target: <span className="font-mono text-[#f6c492] font-semibold">{selectedHours} hrs/day</span> ({Math.round(selectedHours * 60)} minutes)
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.5"
            value={selectedHours}
            onChange={(e) => setSelectedHours(parseFloat(e.target.value))}
            aria-label="Daily study hours"
            className="w-40 sm:w-48 accent-[#e28766] cursor-pointer"
          />
          <button
            onClick={() => onRegenerateSchedule(selectedHours)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e28766]/15 hover:bg-[#e28766]/25 text-[#f4a261] border border-[#e28766]/30 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-calculate</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Completion Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232838] pb-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#131722] border border-[#232838] rounded-xl">
          {(['all', 'planned', 'completed', 'rescheduled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-[#1e2436] text-[#fdf8f5] shadow-xs'
                  : 'text-[#8c94a4] hover:text-[#ede7e1]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-[#8c94a4] tabular-nums">
          Completed: <span className="text-[#f6c492] font-semibold">{totalCompletedMinutes}m</span> / {totalScheduledMinutes}m ({completionRate}%)
        </div>
      </div>

      {/* Dedicated Session List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-[#131722]/60 border border-[#232838] rounded-2xl p-12 text-center text-xs text-[#8c94a4]">
            No study sessions found in this view.
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${
                  isCompleted
                    ? 'bg-[#0f131c]/50 border-[#232838]/60 opacity-65'
                    : 'bg-[#131722]/90 border-[#232838] hover:border-[#384157]'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[#f6c492] text-[11px] font-medium">
                      {session.timeSlot || 'Flexible Slot'}
                    </span>
                    <span className="text-[#525a6c]">·</span>
                    <span className="text-[#8c94a4]">{session.subject}</span>
                    <span className="text-[#525a6c]">·</span>
                    <span className="text-[#8c94a4] font-mono text-[11px]">{session.scheduledMinutes} min</span>
                  </div>

                  <h3 className={`text-xl font-serif text-[#fdf8f5] leading-snug ${isCompleted ? 'line-through text-[#8c94a4]' : ''}`}>
                    {session.topicName}
                  </h3>

                  <div className="text-xs text-[#8c94a4] font-light flex items-center gap-2">
                    <span className="text-[#e28766] font-mono font-medium text-[10px]">
                      P{session.priorityScore}
                    </span>
                    <span>{session.reasonPrioritized}</span>
                  </div>

                  {session.notes && (
                    <p className="text-xs text-[#a89f91] italic pt-1 font-serif">
                      Note: {session.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => onUpdateSessionStatus(session.id, 'completed', session.scheduledMinutes)}
                        className="px-4 py-2 rounded-xl bg-[#e28766]/15 hover:bg-[#e28766]/25 text-[#f4a261] border border-[#e28766]/30 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                      <button
                        onClick={() => onUpdateSessionStatus(session.id, 'rescheduled')}
                        className="px-3 py-2 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] text-[#8c94a4] text-xs transition-colors"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#f6c492] font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Logged ({session.actualMinutes || session.scheduledMinutes}m)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131722] border border-[#2b3144] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <h3 className="text-xl font-serif text-[#fdf8f5]">Add Custom Study Session</h3>
              <button
                onClick={() => setShowAddSessionModal(false)}
                className="text-[#8c94a4] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Topic</label>
                <select
                  value={newTopicId}
                  onChange={(e) => setNewTopicId(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.subject} — {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  step="5"
                  value={newDuration}
                  onChange={(e) => setNewDuration(parseInt(e.target.value) || 45)}
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Session Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Solve 3 medium problems on tree traversal"
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d2a] text-[#8c94a4] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#e28766] text-[#0b0e14] font-semibold hover:bg-[#d67655]"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Deadline Modal */}
      {showAddDeadlineModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131722] border border-[#2b3144] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <h3 className="text-xl font-serif text-[#fdf8f5]">Add Academic Exam Date</h3>
              <button
                onClick={() => setShowAddDeadlineModal(false)}
                className="text-[#8c94a4] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Course Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Exam Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Importance Level</label>
                <select
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseInt(e.target.value))}
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                >
                  <option value={5}>5 — Final Comprehensive Examination</option>
                  <option value={4}>4 — Midterm Examination</option>
                  <option value={3}>3 — Major Project Evaluation</option>
                  <option value={2}>2 — Course Quiz Assessment</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDeadlineModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d2a] text-[#8c94a4] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#e28766] text-[#0b0e14] font-semibold hover:bg-[#d67655]"
                >
                  Record Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
