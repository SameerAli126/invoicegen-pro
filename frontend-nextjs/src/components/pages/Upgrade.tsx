import React, { useState } from 'react';
import Link from 'next/link';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useToast } from '../UI/ToastContainer';
import { User } from '../../services/authService';

interface UpgradeProps {
  user: User;
}

const Upgrade: React.FC<UpgradeProps> = ({ user }) => {
  const { showInfo } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for freelancers and small businesses',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        'Up to 50 invoices per month',
        'Basic invoice templates',
        'Email support',
        'PDF export',
        'Basic reporting',
        'Client management'
      ],
      popular: false
    },
    professional: {
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Unlimited invoices',
        'Custom branding & templates',
        'Automatic payment reminders',
        'Advanced reporting & analytics',
        'Priority email support',
        'Multi-currency support',
        'Recurring invoices',
        'Time tracking integration',
        'Custom fields'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large teams and organizations',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        'Everything in Professional',
        'Team collaboration (up to 10 users)',
        'Advanced user permissions',
        'API access',
        'White-label solution',
        'Dedicated account manager',
        'Phone support',
        'Custom integrations',
        'Advanced security features',
        'SLA guarantee'
      ],
      popular: false
    }
  };

  const getPrice = (plan: keyof typeof plans) => {
    return billingCycle === 'monthly' ? plans[plan].monthlyPrice : plans[plan].yearlyPrice;
  };

  const getSavings = (plan: keyof typeof plans) => {
    const monthlyTotal = plans[plan].monthlyPrice * 12;
    const yearlyPrice = plans[plan].yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  const handleUpgrade = (planType: keyof typeof plans) => {
    // TODO: Integrate with Stripe
    showInfo('Coming Soon', `Upgrading to ${plans[planType].name} plan - Stripe integration coming soon!`);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Upgrade Your Plan
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
          Choose the perfect plan for your business needs. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Current Plan Status */}
      {user.role === 'free' && (
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">You're on the Free Plan</h3>
                <p className="text-amber-700">
                  {user.invoiceCount} of {user.monthlyInvoiceLimit} invoices used this month
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-900">
                {Math.round((user.invoiceCount / user.monthlyInvoiceLimit) * 100)}%
              </div>
              <div className="text-sm text-amber-700">Used</div>
            </div>
          </div>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-secondary-100 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-secondary-900 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-secondary-900 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">
              Save up to 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
        {Object.entries(plans).map(([key, plan]) => (
          <Card 
            key={key}
            className={`relative ${
              plan.popular 
                ? 'border-2 border-primary-500 shadow-lg' 
                : selectedPlan === key 
                  ? 'border-2 border-primary-300' 
                  : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
              <p className="text-secondary-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-secondary-900">
                  ${getPrice(key as keyof typeof plans)}
                </span>
                <span className="text-secondary-600">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-success-600 font-medium">
                    Save ${getSavings(key as keyof typeof plans)} per year
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => handleUpgrade(key as keyof typeof plans)}
              >
                {user.role === 'free' ? 'Start Free Trial' : 'Upgrade Now'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Can I change my plan anytime?
            </h3>
            <p className="text-secondary-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-secondary-600">
              We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure Stripe integration.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-secondary-600">
              Yes! All paid plans come with a 14-day free trial. No credit card required to start.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-secondary-600">
              Absolutely. You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-secondary-600 mb-4">
          Need help choosing the right plan?
        </p>
        <Link href="/contact">
          <Button variant="outline">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Upgrade;
