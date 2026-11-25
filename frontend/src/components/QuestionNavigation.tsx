import React from 'react';
import { AttemptAnswerState, StudentQuestion } from '../types';

interface QuestionNavigationProps {
  questions: StudentQuestion[];
  answersMap: Record<string, AttemptAnswerState>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  answersMap,
  currentIndex,
  onSelect,
}) => {
  const answeredCount = questions.filter(
    (q) => answersMap[q._id]?.selectedOptionIndex !== null && answersMap[q._id]?.selectedOptionIndex !== undefined
  ).length;
  const reviewCount = questions.filter((q) => answersMap[q._id]?.markedForReview).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="qm-card p-3 p-md-4">
      <h6 className="text-white fw-semibold mb-3">Question Navigator</h6>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {questions.map((q, idx) => {
          const ans = answersMap[q._id];
          const isAnswered =
            ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined;
          const isReview = Boolean(ans?.markedForReview);
          const isCurrent = idx === currentIndex;

          const classes = [
            'q-nav-tile',
            isReview ? 'review' : isAnswered ? 'answered' : '',
            isCurrent ? 'current' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={q._id}
              type="button"
              onClick={() => onSelect(idx)}
              className={classes}
              title={`Question ${idx + 1}${isReview ? ' (Marked for Review)' : ''}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="d-flex flex-column gap-2 small text-secondary border-top border-secondary border-opacity-10 pt-3">
        <div className="d-flex align-items-center justify-content-between">
          <span className="d-flex align-items-center gap-2">
            <span
              className="rounded-1 d-inline-block"
              style={{ width: 12, height: 12, backgroundColor: '#10b981' }}
            />
            Answered
          </span>
          <span className="fw-semibold text-white">{answeredCount}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <span className="d-flex align-items-center gap-2">
            <span
              className="rounded-1 d-inline-block"
              style={{ width: 12, height: 12, backgroundColor: '#8b5cf6' }}
            />
            Marked for Review
          </span>
          <span className="fw-semibold text-white">{reviewCount}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <span className="d-flex align-items-center gap-2">
            <span
              className="rounded-1 d-inline-block"
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#1e293b',
                border: '1px solid rgba(148,163,184,0.4)',
              }}
            />
            Unanswered
          </span>
          <span className="fw-semibold text-white">{unansweredCount}</span>
        </div>
      </div>
    </div>
  );
};
