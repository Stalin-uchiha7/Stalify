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
          throw new Error('Failed to exchange code for tokens');
        }

        const data = await response.json();
        
            // Store tokens and user data
            login(data.accessToken, data.user, data.refreshToken);
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => navigate('/dashboard'), 1500);
        
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message || 'An error occurred during authentication.');
        setStatus('error');
        setTimeout(() => navigate('/login'), 3000);
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
              <button
                onClick={() => navigate('/login')}
                className="mt-4 px-4 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Callback;
