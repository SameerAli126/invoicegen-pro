import React, { useState } from 'react';
import Link from 'next/link';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
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
              <span className="text-xl font-bold text-secondary-900 hidden sm:block">
                InvoiceGen Pro
              </span>
              <span className="text-lg font-bold text-secondary-900 sm:hidden">
                IGP
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/invoices"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Invoices
                </Link>
                <Link
                  href="/clients"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Clients
                </Link>
                {user.role === 'free' && (
                  <Link
                    href="/upgrade"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/features"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Pricing
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <UserDropdown user={user} onLogout={onLogout || (() => {})} />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserDropdown user={user} onLogout={onLogout || (() => {})} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/invoices"
                    className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Invoices
                  </Link>
                  <Link
                    href="/clients"
                    className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Clients
                  </Link>
                  {user.role === 'free' && (
                    <Link
                      href="/upgrade"
                      className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/features"
                    className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
