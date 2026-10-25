import { Topic, ExamDeadline, RevisionItem, StudySession } from '../types';

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation
 * Quality q:
 * 1: Again (Blackout, failed to recall)
 * 2: Hard (Recalled with intense difficulty)
 * 3: Good (Recalled with reasonable hesitation)
 * 4: Easy (Flawless, instantaneous recall)
 */
export function calculateSM2NextReview(
  item: RevisionItem,
  quality: 1 | 2 | 3 | 4
): {
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  dueDate: string;
} {
  let { easeFactor, repetitionCount, intervalDays } = item;

  // EF calculation: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // We scale quality from 1-4 to 2-5 for SM-2 standard formula
  const qSM2 = quality + 1; // 1 -> 2, 2 -> 3, 3 -> 4, 4 -> 5
  let newEF = easeFactor + (0.1 - (5 - qSM2) * (0.08 + (5 - qSM2) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newRepetition = repetitionCount;
  let newInterval = 1;

  if (quality === 1) {
    // Failed recall -> reset repetition
    newRepetition = 0;
    newInterval = 1;
  } else if (quality === 2) {
    // Hard recall
    newRepetition += 1;
    newInterval = Math.max(1, Math.round(intervalDays * 1.2));
  } else if (quality === 3) {
    // Good recall
    if (newRepetition === 0) {
      newInterval = 1;
    } else if (newRepetition === 1) {
      newInterval = 4;
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
    newRepetition += 1;
  } else {
    // Easy recall
    if (newRepetition === 0) {
      newInterval = 3;
    } else if (newRepetition === 1) {
      newInterval = 7;
    } else {
      newInterval = Math.round(intervalDays * newEF * 1.3);
    }
    newRepetition += 1;
  }

  // Calculate new due date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  const dueDateStr = nextDate.toISOString().split('T')[0];

  return {
    intervalDays: newInterval,
    repetitionCount: newRepetition,
    easeFactor: parseFloat(newEF.toFixed(2)),
    dueDate: dueDateStr
  };
}

/**
 * Priority Scoring Engine for Study Sessions
 * Computes deterministic score based on:
 * 1. Proximity of closest exam deadline in that subject
 * 2. Topic difficulty & importance rating
 * 3. Recent quiz weakness (1.0 - accuracy)
 * 4. Active spaced-repetition overdue status
 */
export function calculateTopicPriority(
  topic: Topic,
  deadlines: ExamDeadline[],
  revisions: RevisionItem[]
): { score: number; reason: string } {
  const subjectDeadlines = deadlines
    .filter((d) => d.subject.toLowerCase() === topic.subject.toLowerCase())
    .map((d) => {
      const today = new Date();
      const examDate = new Date(d.date);
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...d, diffDays };
    })
    .filter((d) => d.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  const nearestExam = subjectDeadlines[0];
  let deadlineWeight = 0;
  let deadlineReason = '';

  if (nearestExam) {
    if (nearestExam.diffDays <= 3) {
      deadlineWeight = 40 * (nearestExam.weight / 5);
      deadlineReason = `Exam in ${nearestExam.diffDays}d (${nearestExam.subject})`;
    } else if (nearestExam.diffDays <= 7) {
      deadlineWeight = 28 * (nearestExam.weight / 5);
      deadlineReason = `Exam next week (${nearestExam.diffDays}d away)`;
    } else if (nearestExam.diffDays <= 14) {
      deadlineWeight = 16 * (nearestExam.weight / 5);
      deadlineReason = `Exam in ${nearestExam.diffDays}d`;
    } else {
      deadlineWeight = 8;
      deadlineReason = `Upcoming exam in ${nearestExam.diffDays}d`;
    }
  }

  // Weakness weight: up to 35 points if accuracy is low
  const accuracy = topic.accuracyRate;
  const weaknessWeight = (1.0 - accuracy) * 35;
  const weaknessReason = accuracy < 0.6 ? `Weak accuracy (${Math.round(accuracy * 100)}%)` : '';

  // Topic inherent difficulty & importance (up to 25 points)
  const intrinsicWeight = ((topic.difficulty * 0.5 + topic.importance * 0.5) / 5) * 20;

  // Revision overdue bonus (+15 points)
  const matchingRevision = revisions.find((r) => r.topicId === topic.id);
  const isOverdue = matchingRevision?.status === 'overdue';
  const revisionBonus = isOverdue ? 15 : matchingRevision?.status === 'due' ? 8 : 0;
  const revisionReason = isOverdue ? 'Overdue Spaced Revision' : matchingRevision?.status === 'due' ? 'Revision Due Today' : '';

  const totalScore = Math.round(deadlineWeight + weaknessWeight + intrinsicWeight + revisionBonus);

  // Construct readable explanation
  const reasons = [deadlineReason, weaknessReason, revisionReason].filter(Boolean);
  const finalReason = reasons.length > 0
    ? reasons.join(' · ')
    : `Standard priority (Difficulty: ${topic.difficulty}/5, Importance: ${topic.importance}/5)`;

  return {
    score: totalScore,
    reason: finalReason
  };
}

/**
 * Generate Adaptive Daily Schedule
 */
export function generateAdaptiveDailySchedule(
  topics: Topic[],
  deadlines: ExamDeadline[],
  revisions: RevisionItem[],
  availableHours: number,
  currentDateStr: string = new Date().toISOString().split('T')[0]
): StudySession[] {
  // Score all topics
  const scoredTopics = topics.map((t) => {
    const { score, reason } = calculateTopicPriority(t, deadlines, revisions);
    return {
      topic: t,
      score,
      reason
    };
  });

  // Sort descending by score
  scoredTopics.sort((a, b) => b.score - a.score);

  // Target slot size: 45 to 60 minutes
  const totalAvailableMinutes = availableHours * 60;
  let allocatedMinutes = 0;
  const sessions: StudySession[] = [];

  const timeSlots = ['09:00 - 09:50', '10:15 - 11:05', '14:00 - 14:50', '16:00 - 16:50', '19:30 - 20:20'];
  let slotIndex = 0;

  for (const item of scoredTopics) {
    if (allocatedMinutes >= totalAvailableMinutes) break;

    const sessionMinutes = Math.min(50, totalAvailableMinutes - allocatedMinutes);
    if (sessionMinutes < 25) break;

    sessions.push({
      id: `session-${Date.now()}-${item.topic.id}`,
      topicId: item.topic.id,
      topicName: item.topic.name,
      subject: item.topic.subject,
      date: currentDateStr,
      timeSlot: timeSlots[slotIndex % timeSlots.length],
      scheduledMinutes: sessionMinutes,
      status: 'planned',
      priorityScore: item.score,
      reasonPrioritized: item.reason
    });

    allocatedMinutes += sessionMinutes;
    slotIndex++;
  }

  return sessions;
}
