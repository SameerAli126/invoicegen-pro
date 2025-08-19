// 🤖 Smart Invoice AI Implementation
// This file contains ready-to-use AI functions for invoice generation

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract client information from business card or email signature
 * @param {string} input - Raw text from business card or email
 * @returns {Object} Structured client information
 */
export const extractClientInfo = async (input) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Extract client information from the provided text and return a JSON object with the following structure:
        {
          "name": "Client Name",
          "email": "email@example.com",
          "phone": "+1234567890",
          "company": "Company Name",
          "address": "Full Address",
          "website": "https://website.com"
        }
        If any field is not found, use null. Only return valid JSON.`
      }, {
        role: "user", 
        content: input
      }],
      temperature: 0.1,
      max_tokens: 500
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      data: result,
      confidence: 0.9 // You can implement confidence scoring
    };
  } catch (error) {
    console.error('Error extracting client info:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Generate intelligent invoice items based on service type and client industry
 * @param {string} serviceType - Type of service (e.g., "web development", "consulting")
 * @param {string} clientIndustry - Client's industry (e.g., "healthcare", "finance")
 * @param {number} projectBudget - Estimated project budget
 * @returns {Array} Array of invoice items with descriptions and suggested prices
 */
export const generateInvoiceItems = async (serviceType, clientIndustry, projectBudget = null) => {
  try {
    const budgetContext = projectBudget ? `The total project budget is approximately $${projectBudget}.` : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are an expert business consultant. Generate professional invoice items for the specified service and industry. Return a JSON array of items with this structure:
        [
          {
            "description": "Detailed service description",
            "quantity": 1,
            "unitPrice": 1500.00,
            "category": "Development/Consulting/Design",
            "notes": "Additional notes or deliverables"
          }
        ]
        Make descriptions professional and specific to the industry. Price items realistically based on market rates. ${budgetContext}`
      }, {
        role: "user", 
        content: `Service Type: ${serviceType}\nClient Industry: ${clientIndustry}\n${budgetContext}`
      }],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    const items = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      items: items,
      totalEstimate: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    };
  } catch (error) {
    console.error('Error generating invoice items:', error);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
};

/**
 * Suggest optimal pricing based on service description and market data
 * @param {string} serviceDescription - Description of the service
 * @param {string} clientSize - Size of client company (startup, small, medium, enterprise)
 * @param {Object} historicalData - Past pricing data for similar services
 * @returns {Object} Pricing suggestions with reasoning
 */
export const suggestPricing = async (serviceDescription, clientSize, historicalData = {}) => {
  try {
    const historicalContext = Object.keys(historicalData).length > 0 
      ? `Historical pricing data: ${JSON.stringify(historicalData)}` 
      : 'No historical data available.';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a pricing expert. Analyze the service and provide pricing recommendations. Return JSON with this structure:
        {
          "suggestedPrice": 2500.00,
          "priceRange": {
            "min": 2000.00,
            "max": 3000.00
          },
          "confidence": 0.85,
          "reasoning": "Detailed explanation of pricing rationale",
          "marketPosition": "competitive/premium/budget",
          "adjustmentFactors": [
            "Client size premium: +15%",
            "Service complexity: +10%"
          ]
        }`
      }, {
        role: "user", 
        content: `Service: ${serviceDescription}\nClient Size: ${clientSize}\n${historicalContext}`
      }],
      temperature: 0.2,
      max_tokens: 800
    });
    
    const pricingData = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      ...pricingData
    };
  } catch (error) {
    console.error('Error suggesting pricing:', error);
    return {
      success: false,
      error: error.message,
      suggestedPrice: null
    };
  }
};

/**
 * Validate invoice for errors and inconsistencies
 * @param {Object} invoiceData - Complete invoice object
 * @returns {Object} Validation results with suggestions
 */
export const validateInvoice = async (invoiceData) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are an invoice validation expert. Check the invoice for errors and return JSON with this structure:
        {
          "isValid": true,
          "errors": [],
          "warnings": [],
          "suggestions": [],
          "score": 95,
          "issues": [
            {
              "type": "error/warning/suggestion",
              "field": "fieldName",
              "message": "Description of issue",
              "severity": "high/medium/low"
            }
          ]
        }
        Check for: mathematical errors, missing fields, formatting issues, unusual pricing, incomplete client info.`
      }, {
        role: "user", 
        content: `Validate this invoice: ${JSON.stringify(invoiceData, null, 2)}`
      }],
      temperature: 0.1,
      max_tokens: 1000
    });
    
    const validation = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      ...validation
    };
  } catch (error) {
    console.error('Error validating invoice:', error);
    return {
      success: false,
      error: error.message,
      isValid: false
    };
  }
};

/**
 * Generate professional invoice description from basic input
 * @param {string} basicDescription - Simple description like "website work"
 * @param {string} clientIndustry - Client's industry
 * @returns {Object} Enhanced description with professional language
 */
export const enhanceInvoiceDescription = async (basicDescription, clientIndustry) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Transform basic service descriptions into professional invoice line items. Return JSON with:
        {
          "enhancedDescription": "Professional, detailed description",
          "suggestedCategory": "Service category",
          "deliverables": ["List of specific deliverables"],
          "timeframe": "Estimated completion time"
        }`
      }, {
        role: "user", 
        content: `Basic description: ${basicDescription}\nClient industry: ${clientIndustry}`
      }],
      temperature: 0.4,
      max_tokens: 500
    });
    
    const enhanced = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      ...enhanced
    };
  } catch (error) {
    console.error('Error enhancing description:', error);
    return {
      success: false,
      error: error.message,
      enhancedDescription: basicDescription
    };
  }
};

/**
 * Predict payment likelihood based on invoice and client data
 * @param {Object} invoiceData - Invoice information
 * @param {Object} clientHistory - Client's payment history
 * @returns {Object} Payment prediction with risk assessment
 */
export const predictPaymentLikelihood = async (invoiceData, clientHistory) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Analyze payment likelihood based on invoice and client data. Return JSON with:
        {
          "paymentLikelihood": 0.85,
          "riskLevel": "low/medium/high",
          "expectedPaymentDate": "2024-02-15",
          "riskFactors": ["List of risk factors"],
          "recommendations": ["Actionable recommendations"],
          "confidence": 0.9
        }`
      }, {
        role: "user", 
        content: `Invoice: ${JSON.stringify(invoiceData)}\nClient History: ${JSON.stringify(clientHistory)}`
      }],
      temperature: 0.2,
      max_tokens: 800
    });
    
    const prediction = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      ...prediction
    };
  } catch (error) {
    console.error('Error predicting payment:', error);
    return {
      success: false,
      error: error.message,
      paymentLikelihood: 0.5
    };
  }
};

// Export all functions
export default {
  extractClientInfo,
  generateInvoiceItems,
  suggestPricing,
  validateInvoice,
  enhanceInvoiceDescription,
  predictPaymentLikelihood
};
