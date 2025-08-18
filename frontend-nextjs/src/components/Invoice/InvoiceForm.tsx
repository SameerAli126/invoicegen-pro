import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: InvoiceItem[];
  taxRate: number;
  dueDate: string;
  notes: string;
  paymentTerms: string;
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  initialData?: Partial<InvoiceFormData>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  loading = false,
  error,
  initialData
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: '',
    clientEmail: '',
    clientAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 0,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    paymentTerms: 'Payment due within 30 days'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return Math.round((quantity * unitPrice) * 100) / 100;
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return Math.round((subtotal * formData.taxRate / 100) * 100) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

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
      clientAddress: {
        ...prev.clientAddress,
        [field]: value
      }
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = calculateItemTotal(newItems[index].quantity, newItems[index].unitPrice);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0';
      }
    });

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {/* Client Information */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            error={errors.clientName}
            placeholder="Enter client name"
          />
          <Input
            label="Client Email"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => handleInputChange('clientEmail', e.target.value)}
            error={errors.clientEmail}
            placeholder="client@example.com"
          />
        </div>
        
        <h4 className="text-md font-medium text-secondary-900 mt-6 mb-3">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.clientAddress.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <Input
            label="City"
            value={formData.clientAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="New York"
          />
          <Input
            label="State"
            value={formData.clientAddress.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="NY"
          />
          <Input
            label="ZIP Code"
            value={formData.clientAddress.zipCode}
            onChange={(e) => handleAddressChange('zipCode', e.target.value)}
            placeholder="10001"
          />
          <Input
            label="Country"
            value={formData.clientAddress.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder="United States"
          />
        </div>
      </Card>

      {/* Invoice Items */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Invoice Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="border border-secondary-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    error={errors[`item_${index}_description`]}
                    placeholder="Service or product description"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    error={errors[`item_${index}_quantity`]}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Unit Price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    error={errors[`item_${index}_unitPrice`]}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Total</label>
                  <div className="text-lg font-semibold text-secondary-900">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 border-t border-secondary-200 pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Tax Rate:</span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-secondary-600">%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Tax Amount:</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-secondary-200 pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Details */}
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
          />
          <Input
            label="Payment Terms"
            value={formData.paymentTerms}
            onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
            placeholder="Payment due within 30 days"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes or terms..."
          />
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
