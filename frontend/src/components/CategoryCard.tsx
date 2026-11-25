import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';

export const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <Link
      to={`/student/quizzes?category=${category._id}`}
      className="qm-card qm-card-hover p-4 d-flex flex-column text-decoration-none h-100"
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{
            width: 46,
            height: 46,
            backgroundColor: `${category.color}1a`,
            border: `1px solid ${category.color}40`,
          }}
        >
          <CategoryIcon name={category.icon} size={22} color={category.color} />
        </div>
        <span className="badge bg-dark border border-secondary border-opacity-25 text-info">
          {category.quizCount ?? 0} {(category.quizCount ?? 0) === 1 ? 'Quiz' : 'Quizzes'}
        </span>
      </div>

      <h5 className="text-white fw-semibold mb-2 fs-6">{category.name}</h5>
      <p className="text-secondary small flex-grow-1 mb-3">{category.description}</p>

      <div className="d-inline-flex align-items-center gap-1 small fw-medium text-info">
        Explore Quizzes <ArrowRight size={14} />
      </div>
    </Link>
  );
};
