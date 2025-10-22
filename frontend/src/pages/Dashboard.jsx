import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Music, BarChart3, Clock, TrendingUp, Settings, Brain, Activity, Eye } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import GenreChart from '../components/GenreChart';
import StatsSummary from '../components/StatsSummary';
import ListeningPatterns from '../components/ListeningPatterns';
import MusicPersonality from '../components/MusicPersonality';
import AudioFeatures from '../components/AudioFeatures';
import HeatMap from '../components/HeatMap';
import SoundWaveVisualization from '../components/SoundWaveVisualization';
import GenreVisualization3D from '../components/GenreVisualization3D';
import Logo from '../components/Logo';
import { useApiWithRefresh } from '../hooks/useApiWithRefresh';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { makeRequest } = useApiWithRefresh();
  const [stats, setStats] = useState(null);
  const [listeningPatterns, setListeningPatterns] = useState(null);
  const [musicPersonality, setMusicPersonality] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserStats();
    fetchAnalyticsData();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const apiUrl = 'https://stalify.onrender.com';
      console.log('Fetching stats from:', `${apiUrl}/api/stats/summary`);
      
      const response = await makeRequest(`${apiUrl}/api/stats/summary`);

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

  const fetchAnalyticsData = async () => {
    try {
      const apiUrl = 'https://stalify.onrender.com';
      
      // Fetch all analytics data in parallel
      const [patternsRes, personalityRes, featuresRes] = await Promise.all([
        makeRequest(`${apiUrl}/api/analytics/listening-patterns`),
        makeRequest(`${apiUrl}/api/analytics/music-personality`),
        makeRequest(`${apiUrl}/api/analytics/audio-features`)
      ]);

      if (patternsRes.ok) {
        const patternsData = await patternsRes.json();
        setListeningPatterns(patternsData.data);
      }

      if (personalityRes.ok) {
        const personalityData = await personalityRes.json();
        setMusicPersonality(personalityData.data);
      }

      if (featuresRes.ok) {
        const featuresData = await featuresRes.json();
        setAudioFeatures(featuresData.data);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      // Don't set error state for analytics - they're supplementary
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
            <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center space-x-2 sm:space-x-4 hover:opacity-80 transition-opacity"
                  >
                    <Logo size="small" />
                    <div>
                      <p className="text-xs sm:text-sm text-spotify-lightGray hidden sm:block">
                        Welcome back, {user?.display_name}
                      </p>
                      <p className="text-xs text-spotify-lightGray sm:hidden">
                        {user?.display_name}
                      </p>
                    </div>
                  </button>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {user?.images?.[0] && (
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={user.images[0].url}
                        alt={user.display_name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-spotify-lightGray hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className="bg-spotify-gray border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex space-x-0 sm:space-x-8 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: BarChart3 },
                  { id: 'tracks', label: 'Top Tracks', shortLabel: 'Tracks', icon: Music },
                  { id: 'artists', label: 'Top Artists', shortLabel: 'Artists', icon: User },
                  { id: 'genres', label: 'Genres', shortLabel: 'Genres', icon: TrendingUp },
                  { id: 'patterns', label: 'Patterns', shortLabel: 'Patterns', icon: Clock },
                  { id: 'personality', label: 'Personality', shortLabel: 'Personality', icon: Brain },
                  { id: 'features', label: 'Audio Features', shortLabel: 'Features', icon: Activity },
                  { id: 'visualizations', label: 'Visualizations', shortLabel: 'Viz', icon: Eye },
                  { id: 'profile', label: 'Profile', shortLabel: 'Profile', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-3 border-b transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-spotify-green text-white border-b-2'
                        : 'border-transparent text-spotify-lightGray hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-base hidden sm:inline">{tab.label}</span>
                    <span className="text-xs sm:hidden">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
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
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Top Tracks</h2>
                    <div className="grid gap-3 sm:gap-4">
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
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Top Artists</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <div className="space-y-4 sm:space-y-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Music Taste</h2>
                        <GenreChart genres={stats?.genreDistribution} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'patterns' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-4 sm:space-y-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Listening Patterns</h2>
                        <ListeningPatterns patterns={listeningPatterns} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'personality' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-4 sm:space-y-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Music Personality</h2>
                        <MusicPersonality personality={musicPersonality} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-4 sm:space-y-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Audio Features</h2>
                        <AudioFeatures features={audioFeatures} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'visualizations' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Advanced Visualizations</h2>
                        
                        {/* 3D Genre Visualization */}
                        <div className="mb-8">
                          <GenreVisualization3D genres={stats?.genreDistribution} />
                        </div>
                        
                        
                        {/* Heat Map */}
                        <div className="mb-8">
                          <HeatMap patterns={listeningPatterns} />
                        </div>
                        
                        {/* Sound Wave Visualization */}
                        <div className="mb-8">
                          <SoundWaveVisualization audioFeatures={audioFeatures} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Your Profile</h2>
                    
                    {/* Profile Card */}
                    <div className="bg-spotify-gray rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        {user?.images?.[0] && (
                          <img
                            src={user.images[0].url}
                            alt={user.display_name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                          />
                        )}
                        <div className="text-center sm:text-left">
                          <h3 className="text-2xl font-bold text-white mb-2">{user?.display_name}</h3>
                          <p className="text-spotify-lightGray mb-4">{user?.email}</p>
                          <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
                            <div>
                              <p className="text-spotify-lightGray text-sm">Country</p>
                              <p className="text-white font-medium">{user?.country || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-spotify-lightGray text-sm">Followers</p>
                              <p className="text-white font-medium">{user?.followers?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                              <p className="text-spotify-lightGray text-sm">Plan</p>
                              <p className="text-white font-medium capitalize">{user?.product || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-spotify-lightGray text-sm">Spotify ID</p>
                              <p className="text-white font-medium text-xs break-all">{user?.id || 'Unknown'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-spotify-gray rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => window.open(user?.external_urls?.spotify, '_blank')}
                          className="w-full sm:w-auto px-4 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Music className="w-4 h-4" />
                          <span>Open Spotify Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
      </main>
    </div>
  );
};

export default Dashboard;
