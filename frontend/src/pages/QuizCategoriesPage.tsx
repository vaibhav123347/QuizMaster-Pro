import React, { useEffect, useState } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { extractApiError } from '../services/apiClient';
import { categoryService } from '../services/quizPlatformService';
import { Category } from '../types';

export const QuizCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch((err) => setError(extractApiError(err, 'Failed to load categories.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading assessment categories..." />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 text-white fw-bold mb-1">Quiz Categories</h1>
        <p className="text-secondary small mb-0">
          Choose a technical domain to explore targeted assessments.
        </p>
      </div>

      <ErrorBanner message={error} />

      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat._id} className="col-sm-6 col-lg-4">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </div>
  );
};
