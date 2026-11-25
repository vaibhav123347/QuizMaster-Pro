import React, { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizCard } from '../components/QuizCard';
import { extractApiError } from '../services/apiClient';
import { categoryService, quizService } from '../services/quizPlatformService';
import { Category, PaginationMeta, Quiz } from '../types';

export const QuizListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await quizService.getAll({
        page,
        limit: 9,
        search: search || undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
      });
      setQuizzes(res.quizzes);
      setMeta(res.meta);
    } catch (err) {
      setError(extractApiError(err, 'Failed to fetch quizzes.'));
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty]);

  useEffect(() => {
    void loadQuizzes();
  }, [loadQuizzes]);

  const handleFilterChange = (
    nextCategory: string,
    nextDifficulty: string,
    nextSearch: string
  ) => {
    setCategory(nextCategory);
    setDifficulty(nextDifficulty);
    setSearch(nextSearch);
    setPage(1);

    const params: Record<string, string> = {};
    if (nextCategory) params.category = nextCategory;
    if (nextDifficulty) params.difficulty = nextDifficulty;
    if (nextSearch) params.search = nextSearch;
    setSearchParams(params);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 text-white fw-bold mb-1">Available Quizzes</h1>
        <p className="text-secondary small mb-0">
          Filter assessments by domain, difficulty level, or keyword.
        </p>
      </div>

      {/* Filters */}
      <div className="qm-card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control qm-input"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => handleFilterChange(category, difficulty, e.target.value)}
              />
            </div>
          </div>

          <div className="col-sm-6 col-md-4">
            <select
              className="form-select qm-input"
              value={category}
              onChange={(e) => handleFilterChange(e.target.value, difficulty, search)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-md-3">
            <select
              className="form-select qm-input"
              value={difficulty}
              onChange={(e) => handleFilterChange(category, e.target.value, search)}
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingSpinner message="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <div className="qm-card p-5 text-center text-secondary">
          No quizzes match your selected filters.
        </div>
      ) : (
        <>
          <div className="row g-4">
            {quizzes.map((q) => (
              <div key={q._id} className="col-md-6 col-xl-4">
                <QuizCard quiz={q} />
              </div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                type="button"
                className="btn btn-cyber-outline btn-sm px-3"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="align-self-center small text-secondary px-2">
                Page {page} of {meta.totalPages}
              </span>
              <button
                type="button"
                className="btn btn-cyber-outline btn-sm px-3"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
