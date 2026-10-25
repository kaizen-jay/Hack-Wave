import React, { useState } from 'react';
import { RevisionItem, Topic, StudentProfile } from '../types';
import { calculateSM2NextReview } from '../utils/algorithms';
import {
  Brain,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface RevisionTrackerViewProps {
  student: StudentProfile;
  topics: Topic[];
  revisions: RevisionItem[];
  onUpdateRevision: (updatedItem: RevisionItem) => void;
  onAddRevision: (newItem: RevisionItem) => void;
}

export const RevisionTrackerView: React.FC<RevisionTrackerViewProps> = ({
  student,
  topics,
  revisions,
  onUpdateRevision,
  onAddRevision
}) => {
  const [activeFilter, setActiveFilter] = useState<'due' | 'all' | 'upcoming' | 'overdue' | 'mastered'>('due');
  const [reviewingItem, setReviewingItem] = useState<RevisionItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];

  const processedRevisions = revisions.map((rev) => {
    let status = rev.status;
    if (rev.repetitionCount >= 4 && rev.intervalDays >= 14) {
      status = 'mastered';
    } else if (rev.dueDate < todayStr) {
      status = 'overdue';
    } else if (rev.dueDate === todayStr) {
      status = 'due';
    } else {
      status = 'upcoming';
    }
    return { ...rev, status };
  });

  const filteredRevisions = processedRevisions.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const dueCount = processedRevisions.filter((r) => r.status === 'due').length;
  const overdueCount = processedRevisions.filter((r) => r.status === 'overdue').length;
  const upcomingCount = processedRevisions.filter((r) => r.status === 'upcoming').length;
  const masteredCount = processedRevisions.filter((r) => r.status === 'mastered').length;

  const handleApplyRating = (quality: 1 | 2 | 3 | 4) => {
    if (!reviewingItem) return;

    const result = calculateSM2NextReview(reviewingItem, quality);
    const updatedReviewHistory = [
      ...reviewingItem.reviewHistory,
      {
        date: todayStr,
        rating: quality,
        intervalDays: result.intervalDays
      }
    ];

    const updatedItem: RevisionItem = {
      ...reviewingItem,
      intervalDays: result.intervalDays,
      repetitionCount: result.repetitionCount,
      easeFactor: result.easeFactor,
      dueDate: result.dueDate,
      lastReviewedAt: todayStr,
      status: result.intervalDays >= 21 ? 'mastered' : 'upcoming',
      reviewHistory: updatedReviewHistory
    };

    onUpdateRevision(updatedItem);
    setReviewingItem(null);
    setShowAnswer(false);
  };

  const handleAddNewTopicRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = topics.find((t) => t.id === selectedTopicId);
    if (!topic) return;

    const newRev: RevisionItem = {
      id: `rev-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      subject: topic.subject,
      dueDate: todayStr,
      intervalDays: 1,
      repetitionCount: 0,
      easeFactor: 2.5,
      status: 'due',
      lastReviewedAt: null,
      reviewHistory: []
    };

    onAddRevision(newRev);
    setShowAddModal(false);
  };

  const getTopicPrompt = (topicName: string) => {
    if (topicName.toLowerCase().includes('dynamic programming')) {
      return {
        prompt: 'Explain the difference between Overlapping Subproblems and Optimal Substructure. How do you construct the transition formula for 2D knapsack?',
        answer: 'Optimal substructure means optimal solutions contain optimal solutions to subproblems. Overlapping subproblems means subproblems repeat in recursion. State formula: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]).'
      };
    }
    if (topicName.toLowerCase().includes('tree') || topicName.toLowerCase().includes('index')) {
      return {
        prompt: 'Why do relational databases utilize B+ Trees instead of Hash Tables or Binary Trees for disk index storage?',
        answer: 'High branching fanout (100+) minimizes expensive disk I/O depth to 3-4 levels. Furthermore, leaf nodes are linked in a sequential chain, enabling fast range scans (BETWEEN queries).'
      };
    }
    return {
      prompt: `Recall the core invariants, time/space complexity bounds, and common edge cases for ${topicName}.`,
      answer: 'Checklist: 1. State invariant, 2. Boundary conditions (empty, single element, overflow), 3. Asymptotic bounds, 4. Typical exam patterns.'
    };
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Window Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232838] pb-6">
        <div>
          <div className="text-xs font-sans tracking-widest text-[#f6c492] uppercase mb-1">
            Retention Chamber
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#fdf8f5]">
            Spaced Repetition Salon
          </h1>
          <p className="text-xs text-[#8c94a4] font-light max-w-xl mt-1 leading-relaxed">
            Using the SuperMemo SM-2 algorithm to schedule reviews precisely at the moment of forgetting, locking concepts into long-term memory.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Concept Card</span>
        </button>
      </div>

      {/* Atmospheric Window Banner with Mountain Reference */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2b3144] bg-[#131722]/80 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-xs font-mono text-[#f6c492] uppercase tracking-wider">
            SuperMemo SM-2 Interval Function
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#fdf8f5]">
            Counteract the Ebbinghaus Forgetting Curve
          </h2>
          <p className="text-xs text-[#c7cbd4] font-light leading-relaxed">
            Intervals expand with each successful recall: <span className="font-mono text-[#f6c492]">EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))</span>. Failed cards return tomorrow; mastered cards expand by 2x to 3x.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#0b0e14]/70 border border-[#232838] p-3 rounded-xl min-w-[100px]">
              <span className="text-[10px] text-[#8c94a4] uppercase tracking-wider">Due Today</span>
              <div className="text-2xl font-serif text-[#f4a261] tabular-nums mt-0.5">{dueCount}</div>
            </div>
            <div className="bg-[#0b0e14]/70 border border-[#232838] p-3 rounded-xl min-w-[100px]">
              <span className="text-[10px] text-[#8c94a4] uppercase tracking-wider">Mastered</span>
              <div className="text-2xl font-serif text-[#ede7e1] tabular-nums mt-0.5">{masteredCount}</div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none">
          <img
            src="/public/assets/aistudio/image_beca4a12.png"
            alt="Mountains"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232838] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveFilter('due')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'due'
              ? 'bg-[#e28766]/20 text-[#f6c492] border border-[#e28766]/40'
              : 'text-[#8c94a4] hover:text-[#fdf8f5]'
          }`}
        >
          Due Today ({dueCount})
        </button>
        <button
          onClick={() => setActiveFilter('overdue')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'overdue'
              ? 'bg-[#e28766]/20 text-[#e28766] border border-[#e28766]/40'
              : 'text-[#8c94a4] hover:text-[#fdf8f5]'
          }`}
        >
          Overdue ({overdueCount})
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'upcoming'
              ? 'bg-[#181d2a] text-white border border-[#2b3144]'
              : 'text-[#8c94a4] hover:text-[#fdf8f5]'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          onClick={() => setActiveFilter('mastered')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'mastered'
              ? 'bg-[#181d2a] text-[#f6c492] border border-[#2b3144]'
              : 'text-[#8c94a4] hover:text-[#fdf8f5]'
          }`}
        >
          Mastered ({masteredCount})
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#181d2a] text-white border border-[#2b3144]'
              : 'text-[#8c94a4] hover:text-[#fdf8f5]'
          }`}
        >
          All Cards ({processedRevisions.length})
        </button>
      </div>

      {/* Un-Clustered Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRevisions.length === 0 ? (
          <div className="col-span-full bg-[#131722]/60 border border-[#232838] rounded-2xl p-12 text-center text-[#8c94a4] text-xs">
            No retention cards in this category. You are on track with your intervals.
          </div>
        ) : (
          filteredRevisions.map((item) => {
            const isDueOrOverdue = item.status === 'due' || item.status === 'overdue';

            return (
              <div
                key={item.id}
                className="bg-[#131722]/90 border border-[#232838] hover:border-[#384157] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8c94a4] text-[11px] truncate max-w-[150px]">{item.subject}</span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.status === 'overdue'
                          ? 'bg-[#e28766]/20 text-[#e28766] border border-[#e28766]/40'
                          : item.status === 'due'
                          ? 'bg-[#f4a261]/20 text-[#f4a261] border border-[#f4a261]/40'
                          : 'bg-[#181d2a] text-[#8c94a4]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif text-[#fdf8f5] leading-snug">
                    {item.topicName}
                  </h3>

                  <div className="p-3 rounded-xl bg-[#0b0e14]/70 border border-[#232838] text-[11px] space-y-1 font-mono tabular-nums text-[#c7cbd4]">
                    <div className="flex justify-between">
                      <span className="text-[#8c94a4]">Interval:</span>
                      <span className="text-[#f6c492]">{item.intervalDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8c94a4]">Repetition Streak:</span>
                      <span>{item.repetitionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8c94a4]">Ease Factor:</span>
                      <span>{item.easeFactor}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#1e2333]">
                      <span className="text-[#8c94a4]">Due Date:</span>
                      <span className={item.status === 'overdue' ? 'text-[#e28766]' : ''}>{item.dueDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReviewingItem(item);
                    setShowAnswer(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#181d2a] hover:bg-[#e28766] hover:text-[#0b0e14] text-[#fdf8f5] text-xs font-semibold tracking-wide border border-[#2b3144] hover:border-[#e28766] transition-all flex items-center justify-center gap-2"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>{isDueOrOverdue ? 'Begin Recall Review' : 'Review Early'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Focus Review Window (Modal) */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131722] border border-[#2b3144] rounded-3xl max-w-lg w-full p-7 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#f6c492]">
                  Memory Recall Challenge
                </span>
                <h3 className="text-xl font-serif text-[#fdf8f5]">
                  {reviewingItem.topicName}
                </h3>
              </div>
              <button
                onClick={() => setReviewingItem(null)}
                className="text-[#8c94a4] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="bg-[#0b0e14] p-5 rounded-2xl border border-[#232838] space-y-3">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#8c94a4]">
                Question:
              </span>
              <p className="text-sm font-serif text-[#ede7e1] leading-relaxed">
                {getTopicPrompt(reviewingItem.topicName).prompt}
              </p>

              {showAnswer ? (
                <div className="pt-3 border-t border-[#1e2333] space-y-1.5">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#f6c492]">
                    Model Key Points:
                  </span>
                  <p className="text-xs text-[#c7cbd4] leading-relaxed font-light p-3 rounded-xl bg-[#181d2a]/80 border border-[#2b3144]">
                    {getTopicPrompt(reviewingItem.topicName).answer}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="mt-3 text-xs text-[#f4a261] hover:text-[#f6c492] font-medium flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Reveal Key Points & Rate Recall</span>
                </button>
              )}
            </div>

            {showAnswer && (
              <div className="space-y-3">
                <div className="text-xs text-center text-[#8c94a4]">
                  How effortlessly did you recall this concept?
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => handleApplyRating(1)}
                    className="p-3 rounded-xl bg-[#181d2a] hover:bg-[#e28766]/20 border border-[#2b3144] hover:border-[#e28766] text-[#c7cbd4] flex flex-col items-center gap-1"
                  >
                    <span className="font-bold text-[#e28766]">1</span>
                    <span className="text-[10px] text-[#8c94a4]">Again (1d)</span>
                  </button>

                  <button
                    onClick={() => handleApplyRating(2)}
                    className="p-3 rounded-xl bg-[#181d2a] hover:bg-[#f4a261]/20 border border-[#2b3144] hover:border-[#f4a261] text-[#c7cbd4] flex flex-col items-center gap-1"
                  >
                    <span className="font-bold text-[#f4a261]">2</span>
                    <span className="text-[10px] text-[#8c94a4]">Hard</span>
                  </button>

                  <button
                    onClick={() => handleApplyRating(3)}
                    className="p-3 rounded-xl bg-[#181d2a] hover:bg-[#f6c492]/20 border border-[#2b3144] hover:border-[#f6c492] text-[#c7cbd4] flex flex-col items-center gap-1"
                  >
                    <span className="font-bold text-[#f6c492]">3</span>
                    <span className="text-[10px] text-[#8c94a4]">Good</span>
                  </button>

                  <button
                    onClick={() => handleApplyRating(4)}
                    className="p-3 rounded-xl bg-[#181d2a] hover:bg-[#ede7e1]/20 border border-[#2b3144] hover:border-[#ede7e1] text-[#c7cbd4] flex flex-col items-center gap-1"
                  >
                    <span className="font-bold text-[#ede7e1]">4</span>
                    <span className="text-[10px] text-[#8c94a4]">Easy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131722] border border-[#2b3144] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232838] pb-3">
              <h3 className="text-xl font-serif text-[#fdf8f5]">Add Concept to Spaced Repetition</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8c94a4] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddNewTopicRevision} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c7cbd4] mb-1.5 font-medium">Select Topic</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.subject} — {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d2a] text-[#8c94a4] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#e28766] text-[#0b0e14] font-semibold hover:bg-[#d67655]"
                >
                  Schedule Initial Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
