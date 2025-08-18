import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import UserDropdown from '../UI/UserDropdown';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: 'free' | 'premium';
  } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-secondary-900">
                InvoiceGen Pro
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/invoices"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Invoices
                </Link>
                <Link
                  to="/clients"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Clients
                </Link>
                {user.role === 'free' && (
                  <Link
                    to="/upgrade"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Pricing
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserDropdown user={user} onLogout={onLogout || (() => {})} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
