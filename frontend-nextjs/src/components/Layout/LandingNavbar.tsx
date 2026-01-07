'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../UI/Button';

const LandingNavbar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setProgress(Math.min(1, Math.max(0, nextProgress)));
    setIsScrolled(scrollTop > 8);
  };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/#top" className="flex items-center space-x-2">
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
            <span className="text-lg font-bold text-secondary-900">InvoiceGen Pro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-secondary-700">
            <Link href="/#features" className="hover:text-secondary-900 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-secondary-900 transition-colors">
              Pricing
            </Link>
            <Link href="/#cta" className="hover:text-secondary-900 transition-colors">
              Get Started
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="secondary" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white/95 backdrop-blur">
          <div className="px-4 py-3 space-y-2 text-sm font-medium text-secondary-700">
            <Link
              href="/#features"
              className="block hover:text-secondary-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="block hover:text-secondary-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#cta"
              className="block hover:text-secondary-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      <div className="h-1 bg-secondary-200">
        <div
          className={`h-full bg-primary-600 transition-transform duration-150 ease-out origin-left ${isScrolled ? 'opacity-100' : 'opacity-60'}`}
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default LandingNavbar;
