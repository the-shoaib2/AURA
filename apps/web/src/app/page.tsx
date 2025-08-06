'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth, getApiStatus } from '../config/api';

export default function Home() {
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">AURA Workflow Platform</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Frontend (Web):</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Running on port 5174
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Backend (AURA API):</span>
              {loading ? (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                  Checking...
                </span>
              ) : apiHealth ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  Connected (port 8080)
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                  Disconnected
                </span>
              )}
            </div>
            
            {apiStatus && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">API Status:</h3>
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(apiStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 