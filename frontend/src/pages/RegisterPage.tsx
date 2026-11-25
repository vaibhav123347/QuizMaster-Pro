import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Lock, Mail, User as UserIcon, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { BrandLogo } from '../components/BrandLogo';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { extractApiError } from '../services/apiClient';

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    department: z.string().trim().max(80).optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      department: 'Computer Science & Engineering',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        department: values.department,
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setServerError(extractApiError(err, 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className="min-vh-100 cyber-grid-bg d-flex flex-column justify-content-center align-items-center p-3 py-5">
      <div className="mb-4">
        <Link to="/" className="text-decoration-none">
          <BrandLogo />
        </Link>
      </div>

      <div className="qm-card p-4 p-md-5 w-100" style={{ maxWidth: 480 }}>
        <div className="d-flex align-items-center gap-2 text-info small fw-semibold mb-2">
          <UserPlus size={16} />
          STUDENT REGISTRATION
        </div>
        <h1 className="h4 text-white fw-bold mb-1">Create Your Account</h1>
        <p className="text-secondary small mb-4">
          Register to take technical quizzes, track scores, and compete on leaderboards.
        </p>

        <ErrorBanner message={serverError} onDismiss={() => setServerError(null)} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label small text-secondary fw-medium">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <UserIcon size={16} />
              </span>
              <input
                type="text"
                className={`form-control qm-input ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Vaibhav Sharma"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <div className="text-danger small mt-1">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small text-secondary fw-medium">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className={`form-control qm-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="student@college.edu"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <div className="text-danger small mt-1">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small text-secondary fw-medium">Department</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <Building2 size={16} />
              </span>
              <input
                type="text"
                className="form-control qm-input"
                placeholder="Computer Science & Engineering"
                {...register('department')}
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <label className="form-label small text-secondary fw-medium">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className={`form-control qm-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Min 8 chars"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password.message}</div>
              )}
            </div>

            <div className="col-sm-6">
              <label className="form-label small text-secondary fw-medium">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-control qm-input ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Repeat password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <div className="text-danger small mt-1">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-cyber w-100 py-2 mb-3"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </form>

        <div className="text-center small text-secondary">
          Already registered?{' '}
          <Link to="/login" className="text-info text-decoration-none fw-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
