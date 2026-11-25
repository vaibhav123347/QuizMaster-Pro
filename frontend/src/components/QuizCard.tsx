import React from 'react';
import { ArrowRight, Clock, FileQuestion, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Quiz } from '../types';
import { capitalize, getDifficultyBadgeClass } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const categoryColor = quiz.category?.color || '#3b82f6';

  return (
    <div className="qm-card qm-card-hover p-4 d-flex flex-column h-100">
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <span
          className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1"
          style={{
            backgroundColor: `${categoryColor}1a`,
            color: categoryColor,
            border: `1px solid ${categoryColor}40`,
            fontSize: '0.75rem',
          }}
        >
          <CategoryIcon name={quiz.category?.icon} size={13} color={categoryColor} />
          {quiz.category?.name || 'General'}
        </span>
        <span
          className={`badge rounded-pill px-2 py-1 ${getDifficultyBadgeClass(
            quiz.difficulty
          )}`}
          style={{ fontSize: '0.72rem' }}
        >
          {capitalize(quiz.difficulty)}
        </span>
      </div>

      <h5 className="text-white fw-semibold mb-2 fs-6">{quiz.title}</h5>
      <p className="text-secondary small flex-grow-1 mb-3" style={{ lineHeight: 1.55 }}>
        {quiz.description}
      </p>

      <div className="d-flex flex-wrap gap-3 text-secondary small py-2 mb-3 border-top border-bottom border-secondary border-opacity-10">
        <span className="d-inline-flex align-items-center gap-1">
          <Clock size={14} className="text-info" />
          {quiz.durationMinutes} min
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FileQuestion size={14} className="text-primary" />
          {quiz.questionCount} Qs
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <Award size={14} className="text-warning" />
          {quiz.totalMarks} Marks
        </span>
      </div>

      <Link
        to={`/student/quizzes/${quiz._id}/instructions`}
        className="btn btn-cyber btn-sm w-100 py-2 d-inline-flex align-items-center justify-content-center gap-2"
      >
        Start Assessment <ArrowRight size={15} />
      </Link>
    </div>
  );
};
