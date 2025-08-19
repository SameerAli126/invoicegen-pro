import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../UI/Card';
import Button from '../UI/Button';
import WelcomeModal from '../Onboarding/WelcomeModal';
import { User } from '../../services/authService';
import invoiceService, { InvoiceStats } from '../../services/invoiceService';
import clientService, { ClientStats } from '../../services/clientService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  const usagePercentage = (user.invoiceCount / user.monthlyInvoiceLimit) * 100;
  const canCreateInvoice = user.role === 'premium' || user.invoiceCount < user.monthlyInvoiceLimit;

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (!onboardingCompleted) {
      setShowWelcomeModal(true);
    }

    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [invoiceStatsResponse, clientStatsResponse] = await Promise.all([
        invoiceService.getInvoiceStats(),
        clientService.getClientStats()
      ]);

      setInvoiceStats(invoiceStatsResponse.stats);
      setClientStats(clientStatsResponse.stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        user={user}
      />

      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-secondary-600 mt-2">
          Here's what's happening with your invoices today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Invoices */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Invoices</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading ? '...' : invoiceStats?.totals.invoices || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Monthly Usage */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">This Month</p>
              <p className="text-2xl font-bold text-secondary-900">
                {user.invoiceCount}/{user.role === 'premium' ? '∞' : user.monthlyInvoiceLimit}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading ? '...' : invoiceService.formatCurrency(invoiceStats?.totals.amount || 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Status */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                user.role === 'premium' ? 'bg-success-100' : 'bg-secondary-100'
              }`}>
                <svg className={`w-5 h-5 ${
                  user.role === 'premium' ? 'text-success-600' : 'text-secondary-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Plan</p>
              <p className="text-2xl font-bold text-secondary-900 capitalize">{user.role}</p>
            </div>
          </div>
        </Card>

        {/* Quick Action */}
        <Card>
          <div className="text-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full"
              disabled={!canCreateInvoice}
            >
              {canCreateInvoice ? 'New Invoice' : 'Limit Reached'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Usage Progress (for free users) */}
      {user.role === 'free' && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">Monthly Usage</h3>
              <p className="text-secondary-600">
                {user.invoiceCount} of {user.monthlyInvoiceLimit} invoices used this month
              </p>
            </div>
            {usagePercentage >= 80 && (
              <Link href="/upgrade">
                <Button variant="primary" size="sm">
                  Upgrade Now
                </Button>
              </Link>
            )}
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                usagePercentage >= 100 ? 'bg-danger-500' : 
                usagePercentage >= 80 ? 'bg-warning-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          {usagePercentage >= 100 && (
            <p className="text-danger-600 text-sm mt-2">
              You've reached your monthly limit. Upgrade to premium for unlimited invoices.
            </p>
          )}
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
              <Link href="/invoices">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Placeholder for recent invoices */}
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-secondary-900 mb-2">No invoices yet</h4>
                <p className="text-secondary-600 mb-4">
                  Create your first invoice to get started with professional billing.
                </p>
                <Button variant="primary" disabled={!canCreateInvoice}>
                  {canCreateInvoice ? 'Create Your First Invoice' : 'Upgrade to Create Invoices'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!canCreateInvoice}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Add Client
              </Button>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upgrade Prompt (for free users) */}
          {user.role === 'free' && (
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">Upgrade to Premium</h4>
                <p className="text-secondary-600 text-sm mb-4">
                  Get unlimited invoices, custom branding, and automatic reminders.
                </p>
                <Link href="/upgrade">
                  <Button variant="primary" size="sm" className="w-full">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">💡 Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-secondary-600">
                  Set clear payment terms to get paid faster
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-secondary-600">
                  Send invoices immediately after completing work
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-secondary-600">
                  Follow up on overdue invoices promptly
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
