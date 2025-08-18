import React, { useState, useEffect } from 'react';
import { testApiConnection, getApiStatus } from '../../utils/apiClient';

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    connected: boolean | null;
    testing: boolean;
    error: string | null;
  }>({
    connected: null,
    testing: false,
    error: null,
  });

  const apiStatus = getApiStatus();

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, testing: true, error: null }));
    
    try {
      const connected = await testApiConnection();
      setStatus(prev => ({ ...prev, connected, testing: false }));
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        connected: false, 
        testing: false, 
        error: error.message 
      }));
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2">🔧 API Debug Status</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Base URL:</strong> 
          <div className="font-mono text-blue-600 break-all">{apiStatus.baseURL}</div>
        </div>
        
        <div>
          <strong>Environment:</strong> {apiStatus.isProduction ? 'Production' : 'Development'}
        </div>
        
        <div>
          <strong>Has Token:</strong> {apiStatus.hasToken ? '✅ Yes' : '❌ No'}
        </div>
        
        <div className="flex items-center justify-between">
          <strong>Connection:</strong>
          {status.testing ? (
            <span className="text-yellow-600">🔄 Testing...</span>
          ) : status.connected === true ? (
            <span className="text-green-600">✅ Connected</span>
          ) : status.connected === false ? (
            <span className="text-red-600">❌ Failed</span>
          ) : (
            <span className="text-gray-600">❓ Unknown</span>
          )}
        </div>
        
        {status.error && (
          <div className="text-red-600 text-xs">
            <strong>Error:</strong> {status.error}
          </div>
        )}
        
        <button
          onClick={testConnection}
          disabled={status.testing}
          className="w-full mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {status.testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

export default ApiStatus;
