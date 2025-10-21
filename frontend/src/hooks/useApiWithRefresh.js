import { useAuth } from '../context/AuthContext';

export const useApiWithRefresh = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  const makeRequest = async (url, options = {}) => {
    let currentToken = accessToken;

    const makeRequestWithToken = async (token) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the request with the new token
          return makeRequestWithToken(newToken);
        } else {
          throw new Error('Authentication failed');
        }
      }

      return response;
    };

    return makeRequestWithToken(currentToken);
  };

  return { makeRequest };
};
