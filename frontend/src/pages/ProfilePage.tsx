import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, KeyRound, Shield, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { extractApiError } from '../services/apiClient';
import { authService } from '../services/quizPlatformService';
import { formatDateTime } from '../utils/formatters';

const profileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    department: z.string().trim().max(80).optional(),
    bio: z.string().trim().max(300).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        if (!data.currentPassword) return false;
        return (
          data.newPassword.length >= 8 &&
          /[A-Z]/.test(data.newPassword) &&
          /[a-z]/.test(data.newPassword) &&
          /[0-9]/.test(data.newPassword)
        );
      }
      return true;
    },
    {
      message:
        'To change password, provide current password and a strong new password (8+ chars, upper, lower, number)',
      path: ['newPassword'],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      bio: user?.bio || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      const payload: {
        name: string;
        department?: string;
        bio?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name: values.name,
        department: values.department,
        bio: values.bio,
      };
      if (values.newPassword) {
        payload.currentPassword = values.currentPassword;
        payload.newPassword = values.newPassword;
      }
      const updated = await authService.updateProfile(payload);
      await refreshUser();
      reset({
        name: updated.name,
        department: updated.department || '',
        bio: updated.bio || '',
        currentPassword: '',
        newPassword: '',
      });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(extractApiError(err, 'Failed to update profile.'));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 text-white fw-bold mb-1">Account Profile</h1>
        <p className="text-secondary small mb-0">
          Manage your personal details and security credentials.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="qm-card p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                }}
              >
                <UserCheck size={26} color="#fff" />
              </div>
              <div className="min-w-0">
                <div className="fw-bold text-white text-truncate">{user?.name}</div>
                <div className="text-secondary small text-truncate">{user?.email}</div>
              </div>
            </div>

            <div className="d-flex flex-column gap-3 small border-top border-secondary border-opacity-10 pt-3">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Role</span>
                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-uppercase">
                  <Shield size={12} className="me-1" />
                  {user?.role}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Department</span>
                <span className="text-white text-end">{user?.department || '—'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Member Since</span>
                <span className="text-white">{formatDateTime(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="qm-card p-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
            {success && (
              <div
                className="alert d-flex align-items-center gap-2 mb-3 small"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.14)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#6ee7b7',
                }}
              >
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Full Name</label>
                  <input
                    type="text"
                    className={`form-control qm-input ${errors.name ? 'is-invalid' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <div className="text-danger small mt-1">{errors.name.message}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary">Department</label>
                  <input
                    type="text"
                    className="form-control qm-input"
                    {...register('department')}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary">Bio</label>
                <textarea
                  rows={3}
                  className="form-control qm-input"
                  placeholder="Briefly describe your technical focus areas..."
                  {...register('bio')}
                />
              </div>

              <div className="border-top border-secondary border-opacity-10 pt-4 mb-3">
                <div className="d-flex align-items-center gap-2 text-white fw-semibold small mb-3">
                  <KeyRound size={16} className="text-info" />
                  Change Password (Optional)
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control qm-input"
                      placeholder="Required only if changing password"
                      {...register('currentPassword')}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      New Password
                    </label>
                    <input
                      type="password"
                      className={`form-control qm-input ${
                        errors.newPassword ? 'is-invalid' : ''
                      }`}
                      placeholder="Min 8 chars, upper, lower, number"
                      {...register('newPassword')}
                    />
                  </div>
                </div>
                {errors.newPassword && (
                  <div className="text-danger small mt-2">{errors.newPassword.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-cyber px-4 py-2"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
