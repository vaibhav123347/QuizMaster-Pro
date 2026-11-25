import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { BrandLogo } from '../components/BrandLogo';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { extractApiError } from '../services/apiClient';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', {
        replace: true,
      });
    } catch (err) {
      setServerError(extractApiError(err, 'Unable to sign in. Check your credentials.'));
    }
  };

  return (
    <div className="min-vh-100 cyber-grid-bg d-flex flex-column justify-content-center align-items-center p-3">
      <div className="mb-4">
        <Link to="/" className="text-decoration-none">
          <BrandLogo />
        </Link>
      </div>

      <div className="qm-card p-4 p-md-5 w-100" style={{ maxWidth: 440 }}>
        <div className="d-flex align-items-center gap-2 text-info small fw-semibold mb-2">
          <ShieldCheck size={16} />
          SECURE PORTAL ACCESS
        </div>
        <h1 className="h4 text-white fw-bold mb-1">Welcome Back</h1>
        <p className="text-secondary small mb-4">
          Sign in to access your assessments, analytics, and leaderboards.
        </p>

        <ErrorBanner message={serverError} onDismiss={() => setServerError(null)} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label small text-secondary fw-medium">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className={`form-control qm-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="you@university.edu"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <div className="text-danger small mt-1">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label small text-secondary fw-medium">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className={`form-control qm-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <div className="text-danger small mt-1">{errors.password.message}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-cyber w-100 py-2 mb-3"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center small text-secondary">
          New student?{' '}
          <Link to="/register" className="text-info text-decoration-none fw-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
