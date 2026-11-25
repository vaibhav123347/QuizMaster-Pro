import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Lock,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../services/quizPlatformService';
import { Category } from '../types';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  const highlights = [
    {
      icon: <ShieldCheck size={22} className="text-info" />,
      title: 'Zero-Trust Server Grading',
      desc: 'Correct answers never leave the server during live exams. Every submission is validated and scored on the backend.',
    },
    {
      icon: <Clock size={22} className="text-primary" />,
      title: 'Live Exam Engine',
      desc: 'Real-time countdown timer, question navigator palette, mark-for-review workflow, and automatic submission at timeout.',
    },
    {
      icon: <BarChart3 size={22} className="text-warning" />,
      title: 'Deep Analytics & Leaderboards',
      desc: 'Track score progression across domains, review detailed explanations, and benchmark against peers on live leaderboards.',
    },
    {
      icon: <Lock size={22} className="text-success" />,
      title: 'Enterprise Auth & RBAC',
      desc: 'Protected with bcrypt password hashing, JWT authentication, Zod schema validation, Helmet headers, and rate limiting.',
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column cyber-grid-bg">
      <Navbar />

      <main className="flex-grow-1">
        {/* Hero */}
        <section className="container py-5 my-md-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4 small fw-medium"
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  color: '#38bdf8',
                }}
              >
                <Terminal size={14} />
                Intelligent Full-Stack Quiz &amp; Assessment Platform
              </div>

              <h1 className="display-4 fw-bold text-white mb-3 lh-sm">
                Master Engineering &amp;{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Cybersecurity
                </span>{' '}
                Assessments
              </h1>

              <p className="lead text-secondary mb-4" style={{ maxWidth: 620 }}>
                QuizMaster Pro delivers timed technical examinations, instant server-verified
                scoring, granular answer explanations, and real-time performance intelligence
                for students and administrators.
              </p>

              <div className="d-flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link
                    to={dashboardPath}
                    className="btn btn-cyber px-4 py-3 d-inline-flex align-items-center gap-2"
                  >
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-cyber px-4 py-3 d-inline-flex align-items-center gap-2"
                    >
                      Start Student Assessment <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-cyber-outline px-4 py-3 d-inline-flex align-items-center gap-2"
                    >
                      Sign In to Portal
                    </Link>
                  </>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4 mt-4 pt-2 text-secondary small">
                <span className="d-inline-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  9 Core CS &amp; Security Domains
                </span>
                <span className="d-inline-flex align-items-center gap-2">
                  <Zap size={16} className="text-info" />
                  60+ Curated Technical MCQs
                </span>
                <span className="d-inline-flex align-items-center gap-2">
                  <Award size={16} className="text-warning" />
                  Live MongoDB Atlas Persistence
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="qm-card p-4" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-10">
                  <span className="small fw-semibold text-info font-mono">
                    SECURITY TELEMETRY // LIVE EXAM
                  </span>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25">
                    Protected
                  </span>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="qm-surface p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small text-secondary">Grading Engine</div>
                      <div className="fw-semibold text-white">100% Server-Side Verification</div>
                    </div>
                    <ShieldCheck size={22} className="text-info" />
                  </div>
                  <div className="qm-surface p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small text-secondary">Attempt Integrity</div>
                      <div className="fw-semibold text-white">Ownership &amp; Duplicate Guard</div>
                    </div>
                    <Lock size={22} className="text-primary" />
                  </div>
                  <div className="qm-surface p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small text-secondary">Assessment Analytics</div>
                      <div className="fw-semibold text-white">Category Mastery &amp; Rankings</div>
                    </div>
                    <BarChart3 size={22} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="container py-4">
          <div className="row g-4">
            {highlights.map((item) => (
              <div key={item.title} className="col-md-6 col-lg-3">
                <div className="qm-card qm-card-hover p-4 h-100">
                  <div className="mb-3">{item.icon}</div>
                  <h5 className="text-white fs-6 fw-semibold mb-2">{item.title}</h5>
                  <p className="text-secondary small mb-0 lh-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Preview */}
        {categories.length > 0 && (
          <section className="container py-5">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <div>
                <h2 className="h4 text-white fw-bold mb-1">Assessment Domains</h2>
                <p className="text-secondary small mb-0">
                  Curated technical tracks spanning web engineering, databases, and security.
                </p>
              </div>
              <Link to={isAuthenticated ? '/student/quizzes' : '/register'} className="btn btn-cyber-outline btn-sm px-3">
                Explore Assessments
              </Link>
            </div>
            <div className="row g-3">
              {categories.map((cat) => (
                <div key={cat._id} className="col-sm-6 col-lg-4 d-flex">
                  <div className="qm-card qm-domain-preview p-3 d-flex align-items-start gap-3 w-100">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: `${cat.color}1a`,
                        border: `1px solid ${cat.color}40`,
                      }}
                    >
                      <CategoryIcon name={cat.icon} size={20} color={cat.color} />
                    </div>
                    <div className="qm-domain-preview__content">
                      <div className="text-white fw-semibold small mb-1">{cat.name}</div>
                      <div className="qm-domain-preview__description">
                        {cat.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
