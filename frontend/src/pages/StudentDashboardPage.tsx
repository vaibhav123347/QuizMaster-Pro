import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Layers,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryBarChart, ScoreTrendChart } from '../components/AnalyticsCharts';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuizCard } from '../components/QuizCard';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../hooks/useAuth';
import { extractApiError } from '../services/apiClient';
import { dashboardService } from '../services/quizPlatformService';
import { StudentDashboardData } from '../types';
import { formatDateTime } from '../utils/formatters';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getStudentDashboard()
      .then(setData)
      .catch((err) => setError(extractApiError(err, 'Failed to load dashboard.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading student dashboard..." />;

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 text-white fw-bold mb-1">
            Welcome back, <span className="text-info">{user?.name}</span>
          </h1>
          <p className="text-secondary small mb-0">
            Track your assessment mastery, review past results, and launch new quizzes.
          </p>
        </div>
        <Link
          to="/student/quizzes"
          className="btn btn-cyber px-4 py-2 d-inline-flex align-items-center gap-2"
        >
          Browse All Quizzes <ArrowRight size={16} />
        </Link>
      </div>

      <ErrorBanner message={error} />

      {data && (
        <>
          {/* Stat cards */}
          <div className="row g-3 g-md-4 mb-4">
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Quizzes Completed"
                value={data.stats.totalAttempts}
                subtitle={`${data.stats.passedCount} passed assessments`}
                icon={<CheckCircle2 size={22} />}
                accentColor="#10b981"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Average Score"
                value={`${data.stats.averageScore}%`}
                subtitle="Across submitted attempts"
                icon={<TrendingUp size={22} />}
                accentColor="#06b6d4"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Best Performance"
                value={`${data.stats.bestScore}%`}
                subtitle="Highest verified score"
                icon={<Award size={22} />}
                accentColor="#f59e0b"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Available Quizzes"
                value={data.stats.availableQuizzesCount}
                subtitle={`Across ${data.stats.categoriesCount} domains`}
                icon={<Layers size={22} />}
                accentColor="#8b5cf6"
              />
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="qm-card p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="text-white fs-6 fw-semibold mb-0">
                    Recent Score Progression
                  </h5>
                  <Target size={18} className="text-info" />
                </div>
                <ScoreTrendChart data={data.scoreTrend} />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="qm-card p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="text-white fs-6 fw-semibold mb-0">
                    Domain Mastery (%)
                  </h5>
                  <BookOpen size={18} className="text-primary" />
                </div>
                <CategoryBarChart
                  data={data.categoryPerformance.map((c) => ({
                    name: c.categoryName,
                    avgScore: c.avgScore,
                    color: c.color,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Recommended Quizzes */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white fw-semibold mb-0">Featured Assessments</h5>
              <Link to="/student/quizzes" className="text-info small text-decoration-none">
                View all quizzes →
              </Link>
            </div>
            <div className="row g-4">
              {data.recommendedQuizzes.map((quiz) => (
                <div key={quiz._id} className="col-md-6 col-xl-3">
                  <QuizCard quiz={quiz} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent attempts */}
          <div className="qm-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white fw-semibold mb-0">Recent Submissions</h5>
              <Link to="/student/history" className="text-info small text-decoration-none">
                Full history →
              </Link>
            </div>
            {data.recentAttempts.length === 0 ? (
              <p className="text-secondary small mb-0">
                You haven&apos;t submitted any quizzes yet. Pick a quiz above to begin!
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table qm-table mb-0">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentAttempts.map((att) => (
                      <tr key={att._id}>
                        <td className="fw-medium text-white">{att.quiz?.title}</td>
                        <td className="text-secondary small">{att.category?.name}</td>
                        <td className="font-mono fw-semibold text-info">
                          {att.scoredMarks}/{att.totalMarks} ({att.percentage}%)
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              att.passed
                                ? 'bg-success bg-opacity-25 text-success'
                                : 'bg-danger bg-opacity-25 text-danger'
                            }`}
                          >
                            {att.passed ? 'Passed' : 'Needs Review'}
                          </span>
                        </td>
                        <td className="text-secondary small">
                          {formatDateTime(att.submittedAt)}
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/student/results/${att._id}`}
                            className="btn btn-cyber-outline btn-sm px-3"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
