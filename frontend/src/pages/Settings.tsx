import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { User } from '../services/authService';

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
    marketingEmails: false
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
    alert('Notification settings update functionality coming soon!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'billing', name: 'Billing', icon: '💳' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
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
