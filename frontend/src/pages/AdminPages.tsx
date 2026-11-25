import React, { useEffect, useState } from 'react';
import { FolderKanban, LayoutDashboard, Trophy, Users } from 'lucide-react';
import { CategoryBarChart, AttemptsVolumeChart } from '../components/AnalyticsCharts';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { extractApiError } from '../services/apiClient';
import {
  categoryService,
  dashboardService,
  questionService,
  quizService,
  userService,
} from '../services/quizPlatformService';
import { AdminDashboardData, Category, Quiz, AdminQuestion, User } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    dashboardService.getAdminDashboard().then(setData).catch((err) => setError(extractApiError(err)));
  }, []);
  if (error) return <ErrorBanner message={error} />;
  if (!data) return <LoadingSpinner message="Loading administrator console..." />;
  return (
    <div>
      <h1 className="h3 text-white mb-4">Admin Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard title="Students" value={data.stats.totalStudents} subtitle={`${data.stats.activeStudents} active`} icon={<Users size={21} />} /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Quizzes" value={data.stats.totalQuizzes} subtitle={`${data.stats.activeQuizzes} active`} accentColor="#8b5cf6" icon={<Trophy size={21} />} /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Average Score" value={`${data.stats.averagePerformance.toFixed(1)}%`} subtitle={`${data.stats.passRate.toFixed(1)}% pass rate`} accentColor="#10b981" icon={<LayoutDashboard size={21} />} /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Attempts" value={data.stats.totalAttempts} subtitle={`${data.stats.autoSubmittedCount} auto-submitted`} accentColor="#f59e0b" icon={<FolderKanban size={21} />} /></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-lg-6"><div className="qm-card p-3"><h2 className="h6 text-white">Category Performance</h2><CategoryBarChart data={data.categoryAnalytics.map((item) => ({ name: item.name, avgScore: item.avgScore, color: item.color }))} /></div></div>
        <div className="col-lg-6"><div className="qm-card p-3"><h2 className="h6 text-white">Attempt Activity</h2><AttemptsVolumeChart data={data.dailyAttemptsTrend} /></div></div>
      </div>
      <div className="qm-card p-3">
        <h2 className="h6 text-white mb-3">Recent Attempts</h2>
        {data.recentAttempts.map((attempt) => <div key={attempt._id} className="d-flex justify-content-between border-bottom border-secondary border-opacity-10 py-2"><span>{attempt.user?.name || 'Student'} · {attempt.quiz.title}</span><b className={attempt.passed ? 'text-success' : 'text-danger'}>{attempt.percentage.toFixed(1)}%</b></div>)}
      </div>
    </div>
  );
};

export const AdminCategoriesPage: React.FC = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => categoryService.getAll(true).then(setItems).catch((err) => setError(extractApiError(err)));
  useEffect(() => { void load(); }, []);
  const remove = async (item: Category) => {
    if (!window.confirm(`Delete category "${item.name}"?`)) return;
    await categoryService.remove(item._id);
    await load();
  };
  return (
    <div><h1 className="h3 text-white mb-4">Manage Categories</h1><ErrorBanner message={error} />
      <div className="row g-3">{items.map((item) => <div key={item._id} className="col-md-6 col-xl-4"><div className="qm-card p-3"><div className="d-flex justify-content-between"><b className="text-white">{item.name}</b><span className={`badge ${item.isActive ? 'bg-success' : 'bg-secondary'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></div><p className="text-secondary small mt-2 mb-3">{item.description}</p><button className="btn btn-outline-danger btn-sm" onClick={() => void remove(item)}>Delete</button></div></div>)}</div>
    </div>
  );
};

export const AdminQuizzesPage: React.FC = () => {
  const [items, setItems] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => quizService.getAll({ limit: 50, includeInactive: true }).then((data) => setItems(data.quizzes)).catch((err) => setError(extractApiError(err)));
  useEffect(() => { void load(); }, []);
  const toggle = async (item: Quiz) => { await quizService.toggleStatus(item._id, !item.isActive); await load(); };
  const remove = async (item: Quiz) => { if (!window.confirm(`Delete quiz "${item.title}"?`)) return; await quizService.remove(item._id); await load(); };
  return (
    <div><h1 className="h3 text-white mb-4">Manage Quizzes</h1><ErrorBanner message={error} />
      {items.map((item) => <div key={item._id} className="qm-card p-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-3"><div><b className="text-white">{item.title}</b><div className="text-muted small">{item.category.name} · {item.difficulty} · {item.questionCount} questions</div></div><div className="d-flex gap-2"><button className={`btn btn-sm ${item.isActive ? 'btn-cyber-outline' : 'btn-cyber'}`} onClick={() => void toggle(item)}>{item.isActive ? 'Deactivate' : 'Activate'}</button><button className="btn btn-outline-danger btn-sm" onClick={() => void remove(item)}>Delete</button></div></div>)}
    </div>
  );
};

export const AdminQuestionsPage: React.FC = () => {
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => questionService.getAllAdmin({ limit: 100 }).then((data) => setItems(data.questions)).catch((err) => setError(extractApiError(err)));
  useEffect(() => { void load(); }, []);
  const remove = async (item: AdminQuestion) => { if (!window.confirm('Delete this question?')) return; await questionService.remove(item._id); await load(); };
  return (
    <div><h1 className="h3 text-white mb-4">Manage Questions</h1><ErrorBanner message={error} />
      {items.map((item) => <div key={item._id} className="qm-card p-3 mb-3 d-flex justify-content-between gap-3"><div><b className="text-white">{item.text}</b><div className="text-muted small">{item.difficulty} · {item.marks} marks</div></div><button className="btn btn-outline-danger btn-sm align-self-start" onClick={() => void remove(item)}>Delete</button></div>)}
    </div>
  );
};

export const AdminStudentsPage: React.FC = () => {
  const [items, setItems] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => userService.getAll({ role: 'student', limit: 100 }).then((data) => setItems(data.users)).catch((err) => setError(extractApiError(err)));
  useEffect(() => { void load(); }, []);
  const toggle = async (item: User) => { await userService.updateStatus(item._id, !item.isActive); await load(); };
  const remove = async (item: User) => { if (!window.confirm(`Delete student "${item.name}"?`)) return; await userService.remove(item._id); await load(); };
  return (
    <div><h1 className="h3 text-white mb-4">Manage Students</h1><ErrorBanner message={error} />
      {items.map((item) => <div key={item._id} className="qm-card p-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-3"><div><b className="text-white">{item.name}</b><div className="text-muted small">{item.email} · {item.department || 'No department'}</div></div><div className="d-flex gap-2"><button className={`btn btn-sm ${item.isActive ? 'btn-cyber-outline' : 'btn-cyber'}`} onClick={() => void toggle(item)}>{item.isActive ? 'Deactivate' : 'Activate'}</button><button className="btn btn-outline-danger btn-sm" onClick={() => void remove(item)}>Delete</button></div></div>)}
    </div>
  );
};
