import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Music, BarChart3, Clock, TrendingUp } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import GenreChart from '../components/GenreChart';
import StatsSummary from '../components/StatsSummary';

const Dashboard = () => {
  const { user, accessToken, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
          <p className="text-spotify-lightGray">Loading your music stats...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchUserStats}
            className="px-4 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-dark">
      {/* Header */}
      <header className="bg-spotify-gray border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music className="w-8 h-8 text-spotify-green" />
              <div>
                <h1 className="text-xl font-bold text-white">Stalify</h1>
                <p className="text-sm text-spotify-lightGray">Welcome back, {user?.display_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user?.images?.[0] && (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-spotify-lightGray hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-spotify-gray border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tracks', label: 'Top Tracks', icon: Music },
              { id: 'artists', label: 'Top Artists', icon: User },
              { id: 'genres', label: 'Genres', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-spotify-green text-white'
                    : 'border-transparent text-spotify-lightGray hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatsSummary stats={stats} />
          </motion.div>
        )}

        {activeTab === 'tracks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Top Tracks</h2>
                <div className="grid gap-4">
                  {stats?.topTracks?.mediumTerm?.items?.slice(0, 10).map((track, index) => (
                    <TrackCard key={track.id} track={track} rank={index + 1} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'artists' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Top Artists</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats?.topArtists?.mediumTerm?.items?.slice(0, 12).map((artist, index) => (
                    <ArtistCard key={artist.id} artist={artist} rank={index + 1} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'genres' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Music Taste</h2>
                <GenreChart genres={stats?.genreDistribution} />
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
