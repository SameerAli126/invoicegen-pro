import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { User } from '../../services/authService';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, user }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to InvoiceGen Pro! 🎉",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Hello {user.name}! 👋
            </h2>
            <p className="text-lg text-secondary-600">
              Welcome to the most powerful invoicing platform for freelancers and small businesses.
            </p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-primary-800 font-medium">
              You're on the <span className="capitalize font-bold">{user.role}</span> plan with{' '}
              {user.role === 'premium' ? 'unlimited' : user.monthlyInvoiceLimit} invoices per month.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "What is InvoiceGen Pro? 💼",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-secondary-700 text-center">
            InvoiceGen Pro is your complete invoicing solution that helps you:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="sm" className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Get Paid Faster</h3>
              <p className="text-sm text-secondary-600">Professional invoices that clients love to pay</p>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Track Everything</h3>
              <p className="text-sm text-secondary-600">Monitor payments, overdue invoices, and cash flow</p>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Manage Clients</h3>
              <p className="text-sm text-secondary-600">Store client info and track project history</p>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Professional PDFs</h3>
              <p className="text-sm text-secondary-600">Beautiful, branded invoices ready to send</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "How to Get Started 🚀",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-secondary-700 text-center mb-6">
            Follow these simple steps to create your first invoice:
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-secondary-900">Add Your First Client</h3>
                <p className="text-secondary-600">Go to "Clients" and add your client's information including name, email, and address.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-secondary-900">Create Your Invoice</h3>
                <p className="text-secondary-600">Click "New Invoice" to create a professional invoice with line items, taxes, and payment terms.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-secondary-900">Send & Track</h3>
                <p className="text-secondary-600">Send your invoice via email and track when it's viewed and paid.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-success-600 text-white rounded-full flex items-center justify-center font-bold text-sm">✓</div>
              <div>
                <h3 className="font-semibold text-secondary-900">Get Paid!</h3>
                <p className="text-secondary-600">Monitor your dashboard for payment updates and cash flow insights.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Key Features & Tips 💡",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">✨ Pro Features</h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-generated invoice numbers
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automatic tax calculations
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Payment status tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional PDF export
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">💰 Business Tips</h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Set clear payment terms (Net 30, Net 15)
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Send invoices immediately after work completion
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Follow up on overdue invoices promptly
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Offer multiple payment methods
                </li>
              </ul>
            </div>
          </div>
          
          {user.role === 'free' && (
            <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="text-center">
                <h3 className="font-semibold text-primary-900 mb-2">🚀 Ready to Scale?</h3>
                <p className="text-primary-700 text-sm mb-3">
                  Upgrade to Premium for unlimited invoices, custom branding, and automatic reminders.
                </p>
                <Button variant="primary" size="sm">
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          )}
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="xl"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-secondary-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-secondary-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
            {steps[currentStep].title}
          </h1>
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-secondary-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary-600' : 
                  index < currentStep ? 'bg-success-500' : 'bg-secondary-300'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button variant="primary" onClick={handleClose}>
              Get Started! 🚀
            </Button>
          ) : (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
