'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth, getApiStatus } from '../config/api';
import EditorEmbed from '../components/EditorEmbed';

export default function Home() {
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'status' | 'editor'>('status');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkApiHealth();
        setApiHealth(health);
        
        if (health) {
          const status = await getApiStatus();
          setApiStatus(status);
        }
      } catch (error) {
        console.error('Error checking API:', error);
        setApiHealth(false);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">AURA Workflow Platform</h1>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'status'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                System Status
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'editor'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Workflow Editor
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'status' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Frontend Status */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Frontend (Web)</h3>
                    <p className="text-sm text-green-600">Running on port 5174</p>
                  </div>
                </div>
              </div>

              {/* Backend Status */}
              <div className={`p-4 rounded-lg ${apiHealth ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      apiHealth ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      ) : apiHealth ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${apiHealth ? 'text-green-800' : 'text-red-800'}`}>
                      Backend (AURA API)
                    </h3>
                    <p className={`text-sm ${apiHealth ? 'text-green-600' : 'text-red-600'}`}>
                      {loading ? 'Checking...' : apiHealth ? 'Connected (port 8080)' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Editor Status */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Editor UI</h3>
                    <p className="text-sm text-blue-600">Available on port 3000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Status Details */}
            {apiStatus && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">API Status Details:</h3>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(apiStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Workflow Editor</h2>
              <p className="text-gray-600 mt-1">Embedded AURA workflow editor powered by Vite</p>
            </div>
            <div className="h-[600px]">
              <EditorEmbed />
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 