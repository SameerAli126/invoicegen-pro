// 🔍 Document AI Implementation
// OCR, receipt scanning, and document processing

import { GoogleAuth } from 'google-auth-library';
import vision from '@google-cloud/vision';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google Vision client
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

/**
 * Process expense receipt using OCR and AI categorization
 * @param {Buffer|string} imageFile - Image file buffer or base64 string
 * @returns {Object} Extracted expense data
 */
export const processExpenseReceipt = async (imageFile) => {
  try {
    // Step 1: Extract text using Google Vision OCR
    const [result] = await visionClient.textDetection({
      image: { content: imageFile }
    });
    
    const detections = result.textAnnotations;
    const extractedText = detections.length > 0 ? detections[0].description : '';
    
    if (!extractedText) {
      return {
        success: false,
        error: 'No text found in image',
        data: null
      };
    }
    
    // Step 2: Use AI to extract structured data
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Extract expense information from receipt text and return JSON with this structure:
        {
          "vendor": "Vendor Name",
          "amount": 25.99,
          "date": "2024-01-15",
          "category": "Office Supplies",
          "items": ["Item 1", "Item 2"],
          "taxAmount": 2.08,
          "paymentMethod": "Credit Card",
          "receiptNumber": "12345",
          "confidence": 0.95
        }
        If any field cannot be determined, use null. Categories should be business-appropriate.`
      }, {
        role: "user", 
        content: `Extract expense data from this receipt text:\n\n${extractedText}`
      }],
      temperature: 0.1,
      max_tokens: 800
    });
    
    const expenseData = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      rawText: extractedText,
      data: expenseData,
      processingTime: Date.now()
    };
    
  } catch (error) {
    console.error('Error processing receipt:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Categorize expenses automatically using AI
 * @param {string} description - Expense description
 * @param {string} vendor - Vendor name
 * @param {number} amount - Expense amount
 * @returns {Object} Categorization results
 */
export const categorizeExpense = async (description, vendor, amount) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Categorize business expenses and return JSON with this structure:
        {
          "category": "Office Supplies",
          "subcategory": "Stationery",
          "taxDeductible": true,
          "businessPurpose": "Likely business purpose",
          "confidence": 0.9,
          "suggestedTags": ["office", "supplies", "stationery"],
          "notes": "Additional categorization notes"
        }
        
        Common categories: Office Supplies, Travel, Meals & Entertainment, Software, Marketing, Professional Services, Equipment, Utilities, Rent, Insurance, etc.`
      }, {
        role: "user", 
        content: `Categorize this expense:\nDescription: ${description}\nVendor: ${vendor}\nAmount: $${amount}`
      }],
      temperature: 0.2,
      max_tokens: 500
    });
    
    const categorization = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      ...categorization
    };
    
  } catch (error) {
    console.error('Error categorizing expense:', error);
    return {
      success: false,
      error: error.message,
      category: 'Uncategorized'
    };
  }
};

/**
 * Extract key information from contracts and agreements
 * @param {string} contractText - Full contract text
 * @returns {Object} Extracted contract terms
 */
export const analyzeContract = async (contractText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Analyze contract text and extract key terms. Return JSON with this structure:
        {
          "contractType": "Service Agreement",
          "parties": {
            "client": "Client Name",
            "provider": "Service Provider"
          },
          "keyTerms": {
            "totalValue": 50000.00,
            "paymentTerms": "Net 30",
            "startDate": "2024-01-01",
            "endDate": "2024-12-31",
            "deliverables": ["List of deliverables"],
            "milestones": ["Payment milestones"]
          },
          "importantClauses": [
            {
              "type": "Payment",
              "description": "Payment clause details",
              "riskLevel": "low/medium/high"
            }
          ],
          "redFlags": ["Potential issues or concerns"],
          "recommendations": ["Suggested actions"]
        }`
      }, {
        role: "user", 
        content: `Analyze this contract:\n\n${contractText}`
      }],
      temperature: 0.1,
      max_tokens: 1500
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      ...analysis
    };
    
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return {
      success: false,
      error: error.message,
      contractType: 'Unknown'
    };
  }
};

/**
 * Validate invoice documents for completeness and accuracy
 * @param {Object} invoiceData - Invoice data to validate
 * @param {string} documentText - OCR text from invoice document (optional)
 * @returns {Object} Validation results
 */
export const validateInvoiceDocument = async (invoiceData, documentText = null) => {
  try {
    const context = documentText 
      ? `Invoice Data: ${JSON.stringify(invoiceData)}\nDocument Text: ${documentText}`
      : `Invoice Data: ${JSON.stringify(invoiceData)}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Validate invoice document for errors and compliance. Return JSON with this structure:
        {
          "isValid": true,
          "completenessScore": 95,
          "accuracyScore": 98,
          "complianceIssues": [],
          "missingFields": [],
          "mathematicalErrors": [],
          "formatIssues": [],
          "recommendations": [
            {
              "type": "error/warning/suggestion",
              "field": "fieldName",
              "message": "Issue description",
              "severity": "high/medium/low",
              "solution": "How to fix"
            }
          ],
          "overallScore": 96
        }`
      }, {
        role: "user", 
        content: `Validate this invoice:\n\n${context}`
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
    console.error('Error validating invoice document:', error);
    return {
      success: false,
      error: error.message,
      isValid: false
    };
  }
};

/**
 * Extract business card information using OCR and AI
 * @param {Buffer|string} imageFile - Business card image
 * @returns {Object} Extracted contact information
 */
export const processBusinessCard = async (imageFile) => {
  try {
    // Extract text using Google Vision
    const [result] = await visionClient.textDetection({
      image: { content: imageFile }
    });
    
    const detections = result.textAnnotations;
    const extractedText = detections.length > 0 ? detections[0].description : '';
    
    if (!extractedText) {
      return {
        success: false,
        error: 'No text found in business card',
        data: null
      };
    }
    
    // Use AI to structure the information
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Extract contact information from business card text and return JSON with this structure:
        {
          "name": "Full Name",
          "title": "Job Title",
          "company": "Company Name",
          "email": "email@company.com",
          "phone": "+1234567890",
          "mobile": "+1234567890",
          "website": "https://company.com",
          "address": "Full Address",
          "linkedin": "LinkedIn URL",
          "industry": "Industry Type",
          "confidence": 0.95
        }
        If any field is not found, use null.`
      }, {
        role: "user", 
        content: `Extract contact information from this business card text:\n\n${extractedText}`
      }],
      temperature: 0.1,
      max_tokens: 600
    });
    
    const contactData = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      rawText: extractedText,
      data: contactData
    };
    
  } catch (error) {
    console.error('Error processing business card:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Generate expense report from multiple receipts
 * @param {Array} expenseData - Array of processed expense data
 * @param {string} reportPeriod - Report period (e.g., "January 2024")
 * @returns {Object} Generated expense report
 */
export const generateExpenseReport = async (expenseData, reportPeriod) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Generate a professional expense report summary. Return JSON with this structure:
        {
          "reportSummary": {
            "period": "January 2024",
            "totalExpenses": 1250.99,
            "totalTaxDeductible": 1100.50,
            "expenseCount": 15,
            "averageExpense": 83.40
          },
          "categoryBreakdown": [
            {
              "category": "Office Supplies",
              "amount": 250.00,
              "percentage": 20,
              "count": 5
            }
          ],
          "insights": [
            "Spending increased 15% compared to last month",
            "Office supplies represent largest expense category"
          ],
          "recommendations": [
            "Consider bulk purchasing for office supplies",
            "Review subscription services for potential savings"
          ],
          "taxSummary": {
            "deductibleAmount": 1100.50,
            "nonDeductibleAmount": 150.49,
            "estimatedTaxSavings": 275.13
          }
        }`
      }, {
        role: "user", 
        content: `Generate expense report for ${reportPeriod} with this data:\n\n${JSON.stringify(expenseData, null, 2)}`
      }],
      temperature: 0.3,
      max_tokens: 1200
    });
    
    const report = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      ...report
    };
    
  } catch (error) {
    console.error('Error generating expense report:', error);
    return {
      success: false,
      error: error.message,
      reportSummary: null
    };
  }
};

// Export all functions
export default {
  processExpenseReceipt,
  categorizeExpense,
  analyzeContract,
  validateInvoiceDocument,
  processBusinessCard,
  generateExpenseReport
};
