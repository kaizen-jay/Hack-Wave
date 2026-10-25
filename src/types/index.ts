export type SessionStatus = 'planned' | 'completed' | 'skipped' | 'rescheduled';
export type RevisionStatus = 'due' | 'upcoming' | 'overdue' | 'mastered';
export type SkillStatus = 'not_started' | 'in_progress' | 'completed';

export interface ExamDeadline {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  weight: number; // 1 to 5 (e.g., Final Exam = 5, Quiz = 2)
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  roleDescription: string;
  avatarUrl: string;
  careerGoal: string;
  targetGraduationOrInternship: string;
  weeklyTargetHours: number;
  dailyAvailableHours: number;
  currentSkills: string[];
  subjects: string[];
  examDeadlines: ExamDeadline[];
}

export interface Topic {
  id: string;
  subject: string;
  name: string;
  difficulty: number; // 1-5
  importance: number; // 1-5
  accuracyRate: number; // 0 to 1 (e.g. 0.45 = 45%)
  totalQuizAttempts: number;
  lastStudiedAt: string | null;
  needsRevision: boolean;
  notes?: string;
}

export interface StudySession {
  id: string;
  topicId: string;
  topicName: string;
  subject: string;
  date: string; // YYYY-MM-DD
  timeSlot?: string;
  scheduledMinutes: number;
  actualMinutes?: number;
  status: SessionStatus;
  priorityScore: number;
  reasonPrioritized: string;
  notes?: string;
}

export interface RevisionReview {
  date: string;
  rating: number; // 1: Again, 2: Hard, 3: Good, 4: Easy
  intervalDays: number;
}

export interface RevisionItem {
  id: string;
  topicId: string;
  topicName: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number; // standard SM-2 default 2.5
  status: RevisionStatus;
  lastReviewedAt: string | null;
  reviewHistory: RevisionReview[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  topicName: string;
  subject: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  durationSeconds: number;
  incorrectQuestionIds?: string[];
}

export interface RoadmapSkill {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  prerequisites: string[];
  estimatedHours: number;
  description: string;
}

export interface RoadmapProject {
  id: string;
  title: string;
  description: string;
  skillsDemonstrated: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  stageName: string;
  description: string;
  skills: RoadmapSkill[];
  projects: RoadmapProject[];
}

export interface CareerRoadmap {
  id: string;
  careerId: string;
  title: string;
  description: string;
  estimatedMonths: number;
  stages: RoadmapStage[];
}
