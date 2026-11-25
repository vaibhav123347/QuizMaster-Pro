import React from 'react';
import { Clock } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

interface QuizTimerProps {
  remainingSeconds: number;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ remainingSeconds }) => {
  const isCritical = remainingSeconds <= 60;
  const isWarning = remainingSeconds <= 180 && !isCritical;

  const badgeStyle = isCritical
    ? {
        backgroundColor: 'rgba(239, 68, 68, 0.16)',
        borderColor: 'rgba(239, 68, 68, 0.5)',
        color: '#f87171',
      }
    : isWarning
    ? {
        backgroundColor: 'rgba(245, 158, 11, 0.16)',
        borderColor: 'rgba(245, 158, 11, 0.5)',
        color: '#fbbf24',
      }
    : {
        backgroundColor: 'rgba(6, 182, 212, 0.14)',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        color: '#38bdf8',
      };

  return (
    <div
      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border font-mono fw-semibold"
      style={badgeStyle}
    >
      <Clock size={17} />
      <span>{formatDuration(Math.max(0, remainingSeconds))}</span>
    </div>
  );
};
