import { QuizDifficulty } from '../types';

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatDateTime = (iso?: string): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDifficultyBadgeClass = (difficulty: QuizDifficulty | string): string => {
  switch (difficulty) {
    case 'beginner':
    case 'easy':
      return 'badge-beginner';
    case 'intermediate':
    case 'medium':
      return 'badge-intermediate';
    case 'advanced':
    case 'hard':
      return 'badge-advanced';
    default:
      return 'badge-intermediate';
  }
};

export const capitalize = (val: string): string =>
  val ? val.charAt(0).toUpperCase() + val.slice(1) : '';
