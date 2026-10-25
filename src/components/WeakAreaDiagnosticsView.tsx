import React, { useState } from 'react';
import { Topic, QuizAttempt, QuizQuestion, StudentProfile } from '../types';
import { QUESTION_BANK } from '../data/mockData';
import {
  Brain,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  CalendarPlus
} from 'lucide-react';

interface WeakAreaDiagnosticsViewProps {
  student: StudentProfile;
  topics: Topic[];
  quizAttempts: QuizAttempt[];
  selectedTopicForQuiz?: string | null;
  onQuizCompleted: (topicId: string, correctCount: number, totalQuestions: number, durationSeconds: number) => void;
  onScheduleRemediationSession?: (topic: Topic) => void;
}

export const WeakAreaDiagnosticsView: React.FC<WeakAreaDiagnosticsViewProps> = ({
  student,
  topics,
  quizAttempts,
  selectedTopicForQuiz,
  onQuizCompleted,
  onScheduleRemediationSession
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(selectedTopicForQuiz || topics[0]?.id || '');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [generatingAiQuiz, setGeneratingAiQuiz] = useState(false);

  const selectedTopic = topics.find((t) => t.id === activeTopicId) || topics[0];

  const handleStartQuiz = (topicId: string) => {
    const questions = QUESTION_BANK[topicId] || [
      {
        id: `q-fallback-1`,
        topicId: topicId,
        topicName: selectedTopic?.name || 'Topic',
        question: `What fundamental trade-off governs correctness and asymptotic efficiency in ${selectedTopic?.name}?`,
        options: [
          'Memory allocation auxiliary overhead vs. runtime complexity bounds',
          'Database disk size vs. socket latency',
          'Bytecode compilation steps vs. heap fragmentation',
          'Garbage collector cycles vs. single-thread CPU cache misses'
        ],
        correctAnswerIndex: 0,
        explanation: 'Algorithmic optimization frequently trades memory bounds (memoization tables, high-fanout indexes) to drastically minimize runtime computation cycles.',
        difficulty: 'Medium'
      }
    ];

    setActiveTopicId(topicId);
    setActiveQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizStartTime(Date.now());
    setQuizFinished(false);
  };

  const handleGenerateGeminiQuiz = async (topic: Topic) => {
    setGeneratingAiQuiz(true);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.name,
          difficulty: topic.difficulty >= 4 ? 'Hard' : 'Medium'
        })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const formatted: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `gemini-q-${i}`,
          topicId: topic.id,
          topicName: topic.name,
          question: q.question,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex ?? 0,
          explanation: q.explanation || 'Verified conceptual reasoning.',
          difficulty: q.difficulty || 'Medium'
        }));
        setActiveTopicId(topic.id);
        setActiveQuizQuestions(formatted);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setQuizScore(0);
        setQuizStartTime(Date.now());
        setQuizFinished(false);
      }
    } catch (err) {
      handleStartQuiz(topic.id);
    } finally {
      setGeneratingAiQuiz(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !activeQuizQuestions) return;
    setIsAnswerSubmitted(true);
    const q = activeQuizQuestions[currentQuestionIndex];
    if (selectedAnswer === q.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuizQuestions) return;
    if (currentQuestionIndex + 1 < activeQuizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
      setQuizFinished(true);
      onQuizCompleted(activeTopicId, quizScore, activeQuizQuestions.length, totalTime);
    }
  };

  const criticalWeakTopics = topics.filter((t) => t.accuracyRate < 0.5);
  const moderateTopics = topics.filter((t) => t.accuracyRate >= 0.5 && t.accuracyRate < 0.7);
  const proficientTopics = topics.filter((t) => t.accuracyRate >= 0.7);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Window Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232838] pb-6">
        <div>
          <div className="text-xs font-sans tracking-widest text-[#f6c492] uppercase mb-1">
            Diagnostic Sandbox
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#fdf8f5]">
            Weak-Area Diagnostics & Quizzing
          </h1>
          <p className="text-xs text-[#8c94a4] font-light max-w-xl mt-1 leading-relaxed">
            Measures your real conceptual recall on tough exam topics. Low scores trigger targeted practice blocks in your Study Planner.
          </p>
        </div>

        <button
          onClick={() => handleGenerateGeminiQuiz(selectedTopic)}
          disabled={generatingAiQuiz}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{generatingAiQuiz ? 'Consulting Gemini...' : 'AI Practice Drill (Gemini 3.8)'}</span>
        </button>
      </div>

      {/* Main Focus Window Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Assessment Arena (7 cols) */}
        <div className="lg:col-span-7 bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 sm:p-8 min-h-[440px] flex flex-col justify-between">
          {activeQuizQuestions ? (
            quizFinished ? (
              /* Completed Screen */
              <div className="space-y-6 text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#f4a261]/15 text-[#f4a261] flex items-center justify-center mx-auto border border-[#f4a261]/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-[#fdf8f5]">
                    Assessment Complete
                  </h3>
                  <p className="text-xs text-[#8c94a4] font-light">
                    Concept: <span className="text-[#fdf8f5] font-medium">{selectedTopic.name}</span>
                  </p>
                </div>

                <div className="p-5 bg-[#0b0e14] rounded-2xl border border-[#232838] max-w-xs mx-auto space-y-1">
                  <div className="text-4xl font-serif text-[#fdf8f5] tabular-nums">
                    {Math.round((quizScore / activeQuizQuestions.length) * 100)}%
                  </div>
                  <div className="text-xs text-[#8c94a4] font-light">
                    {quizScore} of {activeQuizQuestions.length} correct
                  </div>
                  <div className="text-[11px] text-[#f6c492] pt-1">
                    ✓ Updated in SQLite database and study priorities
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleStartQuiz(activeTopicId)}
                    className="px-4 py-2 rounded-xl bg-[#181d2a] hover:bg-[#1e2436] text-[#ede7e1] text-xs font-medium border border-[#2b3144] flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Drill</span>
                  </button>

                  {onScheduleRemediationSession && (
                    <button
                      onClick={() => onScheduleRemediationSession(selectedTopic)}
                      className="px-4 py-2 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-md shadow-[#e28766]/20"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Schedule Remediation Block</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Active Question */
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-[#8c94a4] border-b border-[#232838] pb-3">
                  <span className="font-mono text-[#f6c492]">
                    Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                  </span>
                  <span className="text-xs font-light">{selectedTopic.name}</span>
                </div>

                <h3 className="text-xl font-serif text-[#fdf8f5] leading-relaxed">
                  {activeQuizQuestions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {activeQuizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeQuizQuestions[currentQuestionIndex].correctAnswerIndex;

                    let style = 'bg-[#181d2a] border-[#2b3144] text-[#ede7e1] hover:border-[#384157]';
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        style = 'bg-[#14231e] border-[#388e6a] text-[#a7f3d0]';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-[#281515] border-[#a84444] text-[#fca5a5]';
                      }
                    } else if (isSelected) {
                      style = 'bg-[#221c26] border-[#e28766] text-white';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-[#2b3144] flex items-center justify-center font-mono text-[10px] shrink-0 font-medium">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 font-light">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#232838] space-y-1 text-xs">
                    <span className="font-sans font-semibold text-xs">
                      {selectedAnswer === activeQuizQuestions[currentQuestionIndex].correctAnswerIndex ? (
                        <span className="text-[#6ee7b7]">Correct Reasoning</span>
                      ) : (
                        <span className="text-[#fca5a5]">Incorrect Response</span>
                      )}
                    </span>
                    <p className="text-[#8c94a4] font-light leading-relaxed text-[11px]">
                      {activeQuizQuestions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232838]">
                  {!isAnswerSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleSubmitAnswer}
                      className="px-5 py-2 rounded-xl bg-[#e28766] disabled:opacity-40 hover:bg-[#d67655] text-[#0b0e14] font-semibold text-xs transition-colors"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>{currentQuestionIndex + 1 < activeQuizQuestions.length ? 'Next Question' : 'View Results'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Idle Screen */
            <div className="text-center py-12 space-y-4 m-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#e28766]/10 border border-[#e28766]/20 text-[#f4a261] flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-serif text-[#fdf8f5]">
                  Select an Area to Begin Diagnosis
                </h3>
                <p className="text-xs text-[#8c94a4] max-w-sm mx-auto font-light leading-relaxed">
                  Choose a topic from the radar on the right or run an immediate diagnostic on your highest-urgency subject.
                </p>
              </div>
              <button
                onClick={() => handleStartQuiz(selectedTopic.id)}
                className="px-5 py-2.5 rounded-xl bg-[#e28766] hover:bg-[#d67655] text-[#0b0e14] text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#e28766]/20"
              >
                Start Diagnostic: {selectedTopic.name}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Performance Matrix & Weakness Radar (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Critical Weak Areas (< 50%) */}
          <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-serif text-[#e28766] text-sm font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Blind Spots (Accuracy &lt; 50%)</span>
            </div>
            <p className="text-[11px] text-[#8c94a4] font-light">
              Topics prioritized for active study blocks in your daily schedule.
            </p>

            <div className="space-y-2.5 pt-1">
              {criticalWeakTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-[#0b0e14]/70 border border-[#2b3144] rounded-xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-[10px] text-[#8c94a4] truncate">{topic.subject}</div>
                    <div className="text-sm font-serif text-[#fdf8f5] truncate">{topic.name}</div>
                    <div className="text-[10px] font-mono text-[#e28766] tabular-nums">
                      {Math.round(topic.accuracyRate * 100)}% accuracy · {topic.totalQuizAttempts} drills
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(topic.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#181d2a] hover:bg-[#e28766] hover:text-[#0b0e14] text-[#c7cbd4] border border-[#2b3144] text-xs font-medium transition-all shrink-0"
                  >
                    Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Developing Topics (50% - 70%) */}
          <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-3">
            <div className="text-sm font-serif text-[#f6c492] font-semibold">
              Developing Concepts (50% — 70%)
            </div>

            <div className="space-y-2">
              {moderateTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-[#0b0e14]/50 border border-[#232838] rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-serif text-[#ede7e1] truncate">{topic.name}</div>
                    <div className="text-[10px] font-mono text-[#8c94a4]">{Math.round(topic.accuracyRate * 100)}%</div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(topic.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#181d2a] text-[#8c94a4] hover:text-white border border-[#232838] text-xs"
                  >
                    Drill
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Proficient Mastery (> 70%) */}
          <div className="bg-[#131722]/90 border border-[#232838] rounded-2xl p-6 space-y-3">
            <div className="text-sm font-serif text-[#a7f3d0] font-semibold">
              Demonstrated Mastery (&ge; 70%)
            </div>

            <div className="space-y-1.5">
              {proficientTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="py-1.5 border-b border-[#1e2333] last:border-0 flex items-center justify-between text-xs font-light text-[#c7cbd4]"
                >
                  <span className="truncate">{topic.name}</span>
                  <span className="font-mono text-[#a7f3d0] tabular-nums font-medium">
                    {Math.round(topic.accuracyRate * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
