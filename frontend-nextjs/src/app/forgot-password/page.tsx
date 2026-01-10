'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '../../components/AppProvider';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import authService from '../../services/authService';

function ForgotPasswordPage() {
  const { user, loading } = useApp();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    recoveryCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!formData.email) {
      nextErrors.email = 'Email is required';
    }

    const code = formData.recoveryCode.trim();
    if (!code) {
      nextErrors.recoveryCode = 'Recovery code is required';
    } else if (!/^\d{9}$/.test(code)) {
      nextErrors.recoveryCode = 'Recovery code must be 9 digits';
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword({
        email: formData.email.trim(),
        recoveryCode: formData.recoveryCode.trim(),
        newPassword: formData.newPassword
      });
      setSuccess('Password reset successful. You can sign in now.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900">Reset your password</h1>
          <p className="text-secondary-600 mt-2 text-sm">
            Enter your 9-digit recovery code and choose a new password.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-sm text-danger-700">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-sm text-success-700">
                {success}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="Enter your email"
            />

            <Input
              label="Recovery code"
              type="text"
              name="recoveryCode"
              value={formData.recoveryCode}
              onChange={handleChange}
              error={formErrors.recoveryCode}
              placeholder="9-digit code"
              helperText="This code was shown after you signed up."
            />

            <Input
              label="New password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={formErrors.newPassword}
              placeholder="Create a new password"
            />

            <Input
              label="Confirm new password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              placeholder="Confirm your new password"
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
              Reset password
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <ForgotPasswordPage />
    </AppProvider>
  );
}
