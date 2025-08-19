import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { User } from '../../services/authService';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    company: '',
    phone: '',
    address: '',
    website: ''
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    taxId: '',
    defaultTaxRate: '8.5',
    defaultPaymentTerms: 'Net 30',
    currency: 'USD',
    invoicePrefix: 'INV',
    invoiceStartNumber: '1001'
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    paymentNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    overdueReminders: true
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US'
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    alert('Profile update functionality coming soon!');
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement business settings update
    alert('Business settings update functionality coming soon!');
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement notification settings update
    alert('Notification settings updated successfully!');
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // TODO: Implement password change
    alert('Password changed successfully!');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: securityData.twoFactorEnabled
    });
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement preferences update
    alert('Preferences updated successfully!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                  <Input
                    label="Company"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Acme Corporation"
                  />
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <Input
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, City, State 12345"
                />
                <Input
                  label="Website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Profile
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'business' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Business Settings</h2>
              <form onSubmit={handleBusinessSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                  />
                  <Input
                    label="Tax ID / EIN"
                    value={businessData.taxId}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, taxId: e.target.value }))}
                    placeholder="12-3456789"
                  />
                  <Input
                    label="Default Tax Rate (%)"
                    type="number"
                    step="0.01"
                    value={businessData.defaultTaxRate}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, defaultTaxRate: e.target.value }))}
                    placeholder="8.5"
                  />
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Default Payment Terms
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={businessData.defaultPaymentTerms}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, defaultPaymentTerms: e.target.value }))}
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Currency
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={businessData.currency}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  <Input
                    label="Invoice Prefix"
                    value={businessData.invoicePrefix}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                    placeholder="INV"
                  />
                  <Input
                    label="Invoice Start Number"
                    type="number"
                    value={businessData.invoiceStartNumber}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, invoiceStartNumber: e.target.value }))}
                    placeholder="1001"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Business Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Notification Preferences</h2>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive general email notifications' },
                    { key: 'invoiceReminders', label: 'Invoice Reminders', description: 'Get reminded about overdue invoices' },
                    { key: 'paymentNotifications', label: 'Payment Notifications', description: 'Notifications when payments are received' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' },
                    { key: 'overdueReminders', label: 'Overdue Reminders', description: 'Automatic reminders for overdue invoices' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and tips' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-secondary-200 last:border-b-0">
                      <div>
                        <h3 className="text-sm font-medium text-secondary-900">{item.label}</h3>
                        <p className="text-sm text-secondary-500">{item.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationData[item.key as keyof typeof notificationData]}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Notification Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Security Settings</h2>
              <div className="space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Change Password</h3>
                  <form onSubmit={handleSecuritySubmit} className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="primary">
                        Change Password
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t border-secondary-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-secondary-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <span className="ml-2 text-sm text-secondary-700">
                        {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="border-t border-secondary-200 pt-6">
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Active Sessions</h3>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Current Session</p>
                        <p className="text-xs text-secondary-500">Windows • Chrome • Last active: Now</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Preferences</h2>
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Number Format */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Number Format
                    </label>
                    <select
                      value={preferences.numberFormat}
                      onChange={(e) => setPreferences(prev => ({ ...prev, numberFormat: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="US">1,234.56 (US)</option>
                      <option value="EU">1.234,56 (EU)</option>
                      <option value="IN">1,23,456.78 (Indian)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Billing & Subscription</h2>
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary-900">
                        Current Plan: {user.role === 'premium' ? 'Premium' : 'Free'}
                      </h3>
                      <p className="text-primary-700">
                        {user.role === 'premium' 
                          ? 'Unlimited invoices and premium features'
                          : `${user.invoiceCount} of ${user.monthlyInvoiceLimit} invoices used this month`
                        }
                      </p>
                    </div>
                    {user.role === 'free' && (
                      <Button variant="primary">
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-secondary-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-secondary-500">Invoices This Month</h4>
                    <p className="text-2xl font-bold text-secondary-900">{user.invoiceCount}</p>
                  </div>
                  <div className="bg-white border border-secondary-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-secondary-500">Monthly Limit</h4>
                    <p className="text-2xl font-bold text-secondary-900">
                      {user.role === 'premium' ? '∞' : user.monthlyInvoiceLimit}
                    </p>
                  </div>
                  <div className="bg-white border border-secondary-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-secondary-500">Account Status</h4>
                    <p className="text-2xl font-bold text-secondary-900 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Plan Features */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Free Plan</h4>
                      <ul className="space-y-1 text-sm text-secondary-600">
                        <li>✓ Up to 5 invoices per month</li>
                        <li>✓ Basic client management</li>
                        <li>✓ Standard templates</li>
                        <li>✓ Email support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Premium Plan</h4>
                      <ul className="space-y-1 text-sm text-secondary-600">
                        <li>✓ Unlimited invoices</li>
                        <li>✓ Advanced analytics</li>
                        <li>✓ Custom branding</li>
                        <li>✓ Priority support</li>
                        <li>✓ Payment integrations</li>
                        <li>✓ Advanced reporting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
