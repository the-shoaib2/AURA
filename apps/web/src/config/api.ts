// API Configuration for connecting to AURA backend
export const API_CONFIG = {
  // Backend API URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    STATUS: '/api/v1/status',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as const,
  },
};

// Helper function to make API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...API_CONFIG.REQUEST_CONFIG,
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const health = await apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
    return health.status === 'OK';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Get API status
export const getApiStatus = async () => {
  return apiRequest(API_CONFIG.ENDPOINTS.STATUS);
}; 