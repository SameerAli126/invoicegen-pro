import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';

interface ForgotPasswordProps {
  onForgotPassword?: (email: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ 
  onForgotPassword, 
  loading = false, 
  error,
  success = false 
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    if (onForgotPassword) {
      try {
        await onForgotPassword(email);
      } catch (err) {
        // Error handling is done by parent component
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-success-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-secondary-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <Card>
            <div className="text-center space-y-4">
              <p className="text-secondary-700">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-danger-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              error={emailError}
              placeholder="Enter your email address"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <p className="text-sm text-secondary-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-xs text-secondary-500">
            Having trouble? Contact our{' '}
            <a href="mailto:support@invoicegen-pro.com" className="text-primary-600 hover:text-primary-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
