import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple API calls
    if (hasProcessed) return;
    
    const handleCallback = async () => {
      setHasProcessed(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError('Access denied. Please try again.');
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setError('No authorization code received.');
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for tokens
        const apiUrl = 'https://stalify.onrender.com';
        console.log('Making request to:', `${apiUrl}/api/auth/callback`);
        const response = await fetch(`${apiUrl}/api/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to exchange code for tokens');
        }

        const data = await response.json();
        
        // Store tokens and user data
        login(data.accessToken, data.user, data.refreshToken);
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => navigate('/dashboard'), 1500);
        
      } catch (err) {
        console.error('Callback error:', err);
        
        // Show user-friendly error message
        let errorMessage = err.message || 'An error occurred during authentication.';
        
        // Handle specific error cases
        if (err.message.includes('not registered')) {
          errorMessage = 'Your Spotify account is not registered for this app. Please contact the developer or try again later.';
        } else if (err.message.includes('invalid_grant')) {
          errorMessage = 'The authorization code has expired. Please try logging in again.';
        } else if (err.message.includes('INVALID_CLIENT')) {
          errorMessage = 'There\'s an issue with the Spotify app configuration. Please try again later.';
        } else if (err.message.includes('access_denied')) {
          errorMessage = 'You denied access to your Spotify account. Please try again and grant the necessary permissions.';
        }
        
        setError(errorMessage);
        setStatus('error');
        setTimeout(() => navigate('/login'), 5000); // Give more time to read the error
      }
    };

    handleCallback();
  }, [navigate, login]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-spotify-green" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Connecting to Spotify...';
      case 'success':
        return 'Successfully connected! Redirecting...';
      case 'error':
        return error || 'Authentication failed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-spotify-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-spotify-gray rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            <h2 className="text-xl font-semibold text-white">
              {getStatusText()}
            </h2>
            {status === 'loading' && (
              <p className="text-spotify-lightGray text-sm">
                Please wait while we authenticate your Spotify account...
              </p>
            )}
            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 text-sm leading-relaxed">
                    {error}
                  </p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <p className="text-spotify-lightGray text-xs">
                    Redirecting to login page in a few seconds...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Callback;
