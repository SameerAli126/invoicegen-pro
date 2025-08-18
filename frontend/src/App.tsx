import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import authService, { User } from './services/authService';
import ApiStatus from './components/Debug/ApiStatus';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.verifyToken();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    // This would integrate with your password reset system
    // For now, just show a success message
    console.log('Password reset requested for:', email);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login
                  onLogin={handleLogin}
                  loading={authLoading}
                  error={authError}
                />
              )
            }
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register
                  onRegister={handleRegister}
                  loading={authLoading}
                  error={authError}
                />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ForgotPassword
                  onForgotPassword={handleForgotPassword}
                  loading={authLoading}
                  error={authError}
                />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/invoices"
            element={
              user ? (
                <Invoices user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/clients"
            element={
              user ? (
                <Clients user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/upgrade"
            element={
              user ? (
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Upgrade to Premium
                    </h1>
                    <p className="text-gray-600">
                      Stripe integration coming soon!
                    </p>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/settings"
            element={
              user ? (
                <Settings user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* API Debug Status - only shows in development */}
      <ApiStatus />
    </Router>
  );
}

export default App;
