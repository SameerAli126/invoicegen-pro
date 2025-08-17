import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
  preferredPaymentTerms: string;
  customPaymentTerms: string;
  taxId: string;
  taxExempt: boolean;
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  initialData?: Partial<ClientFormData>;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  loading = false,
  error,
  initialData
}) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    notes: '',
    preferredPaymentTerms: 'Net 30',
    customPaymentTerms: '',
    taxId: '',
    taxExempt: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.preferredPaymentTerms === 'Custom' && !formData.customPaymentTerms.trim()) {
      newErrors.customPaymentTerms = 'Custom payment terms are required when Custom is selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling is done by parent component
    }
  };

  const paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Due on Receipt',
    'Custom'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="John Doe"
          />
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="john@example.com"
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
          <Input
            label="Company/Organization"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Acme Corporation"
          />
        </div>
      </Card>

      {/* Address Information */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <Input
            label="City"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="New York"
          />
          <Input
            label="State/Province"
            value={formData.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="NY"
          />
          <Input
            label="ZIP/Postal Code"
            value={formData.address.zipCode}
            onChange={(e) => handleAddressChange('zipCode', e.target.value)}
            placeholder="10001"
          />
          <Input
            label="Country"
            value={formData.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder="United States"
          />
        </div>
      </Card>

      {/* Business Information */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Preferred Payment Terms
            </label>
            <select
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.preferredPaymentTerms}
              onChange={(e) => handleInputChange('preferredPaymentTerms', e.target.value)}
            >
              {paymentTermsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {formData.preferredPaymentTerms === 'Custom' && (
            <Input
              label="Custom Payment Terms *"
              value={formData.customPaymentTerms}
              onChange={(e) => handleInputChange('customPaymentTerms', e.target.value)}
              error={errors.customPaymentTerms}
              placeholder="Payment due within 10 days"
            />
          )}
          
          <Input
            label="Tax ID/EIN"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="12-3456789"
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxExempt"
              checked={formData.taxExempt}
              onChange={(e) => handleInputChange('taxExempt', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="taxExempt" className="ml-2 block text-sm text-secondary-900">
              Tax Exempt Organization
            </label>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Additional Information</h3>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about this client, preferences, special requirements, etc."
          />
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Create Client
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
