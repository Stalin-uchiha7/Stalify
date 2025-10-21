import React from 'react';
import { motion } from 'framer-motion';
import { Music, Headphones } from 'lucide-react';

const Login = () => {
  const handleSpotifyLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'd12ec6e0891842689812d902f2176614';
    const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played'
    ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `show_dialog=true`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-spotify-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-spotify-green rounded-full mb-4">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Stalify</h1>
          <p className="text-spotify-lightGray text-lg">Your Spotify Stats, Amplified</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-spotify-lightGray mb-4">
            Connect your Spotify account to discover your unique music taste and listening habits.
          </p>
          <div className="text-sm text-spotify-lightGray space-y-1">
            <p>• View your top tracks and artists</p>
            <p>• Explore your genre preferences</p>
            <p>• Get personalized music insights</p>
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpotifyLogin}
          className="w-full bg-spotify-green hover:bg-green-500 text-white font-semibold py-4 px-6 rounded-full flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Headphones className="w-6 h-6" />
          <span>Connect with Spotify</span>
        </motion.button>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-xs text-spotify-lightGray"
        >
          <p>By connecting, you agree to share your Spotify data with Stalify.</p>
          <p className="mt-1">Your data is used only to generate your music insights.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
