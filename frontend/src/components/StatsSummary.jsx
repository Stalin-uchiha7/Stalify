import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, TrendingUp, Clock, Award, Heart, Play, Pause } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useSpotifyPlayer from '../hooks/useSpotifyPlayer';

const StatsSummary = ({ stats }) => {
  const { accessToken } = useAuth();
  const { isReady, isPlaying, currentTrack, playTrack, togglePlayback } = useSpotifyPlayer(accessToken);

  if (!stats) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading stats...</p>
      </div>
    );
  }

  const summaryCards = [
    {
      icon: Music,
      title: 'Top Tracks Analyzed',
      value: stats.summary?.totalTracksAnalyzed || 0,
      color: 'text-blue-400',
      gradient: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: Users,
      title: 'Top Artists Analyzed',
      value: stats.summary?.totalArtistsAnalyzed || 0,
      color: 'text-purple-400',
      gradient: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: TrendingUp,
      title: 'Unique Genres',
      value: stats.summary?.totalGenres || 0,
      color: 'text-green-400',
      gradient: 'bg-gradient-to-r from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Award,
      title: 'Top Genre',
      value: stats.summary?.topGenre || 'Unknown',
      color: 'text-yellow-400',
      gradient: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30'
    }
  ];

  const topTracks = stats.topTracks?.mediumTerm?.items?.slice(0, 5) || [];
  const topArtists = stats.topArtists?.mediumTerm?.items?.slice(0, 5) || [];

  const handleTrackPlay = (track) => {
    if (isReady && track.uri) {
      if (currentTrack?.id === track.id) {
        togglePlayback();
      } else {
        playTrack(track.uri);
      }
    } else if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Your Music Vibe - Moved to top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-r from-spotify-green/20 to-blue-500/20 rounded-lg p-8 border border-spotify-green/30"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-6 h-6 text-spotify-green" />
          <h3 className="text-xl font-semibold text-white">Your Music Vibe</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-spotify-green mb-2">
              {stats.summary?.topGenre || 'Unknown'}
            </div>
            <p className="text-spotify-lightGray text-sm">Your dominant genre</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.summary?.totalGenres || 0}
            </div>
            <p className="text-spotify-lightGray text-sm">Genres you love</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.summary?.totalTracksAnalyzed || 0}
            </div>
            <p className="text-spotify-lightGray text-sm">Tracks analyzed</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-spotify-lightGray text-sm">
            Based on your listening habits, you have a diverse taste in music with{' '}
            <span className="text-spotify-green font-medium">
              {stats.summary?.totalGenres || 0} different genres
            </span>{' '}
            in your top artists. Your music taste is{' '}
            <span className="text-spotify-green font-medium">
              {stats.summary?.topGenre || 'eclectic'}
            </span>
            -focused, showing your love for great music!
          </p>
        </div>
      </motion.div>

      {/* Quick Stats Grid - Top Tracks and Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Top Tracks Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-spotify-gray rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Music className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Your Top Tracks</h3>
          </div>
          <div className="space-y-3">
            {topTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrentTrack && isPlaying;
              
              return (
                <div key={track.id} className={`flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-700/50 ${
                  isCurrentTrack ? 'bg-spotify-green/10' : ''
                }`}>
                  <span className="text-spotify-lightGray text-sm font-medium w-6">
                    #{index + 1}
                  </span>
                  <img
                    src={track.album?.images?.[0]?.url}
                    alt={track.album?.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCurrentTrack ? 'text-spotify-green' : 'text-white'
                    }`}>
                      {track.name}
                    </p>
                    <p className="text-spotify-lightGray text-xs truncate">
                      {track.artists?.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrackPlay(track)}
                    className={`p-1 rounded-full transition-colors ${
                      isTrackPlaying 
                        ? 'text-spotify-green' 
                        : 'text-spotify-lightGray hover:text-spotify-green'
                    }`}
                    title={isReady ? (isTrackPlaying ? 'Pause' : 'Play') : 'Open in Spotify'}
                  >
                    {isTrackPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Artists Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-spotify-gray rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Your Top Artists</h3>
          </div>
          <div className="space-y-3">
            {topArtists.map((artist, index) => (
              <div key={artist.id} className="flex items-center space-x-3">
                <span className="text-spotify-lightGray text-sm font-medium w-6">
                  #{index + 1}
                </span>
                <img
                  src={artist.images?.[0]?.url}
                  alt={artist.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {artist.name}
                  </p>
                  <p className="text-spotify-lightGray text-xs">
                    {artist.followers?.total?.toLocaleString()} followers
                  </p>
                </div>
                <div className="text-spotify-green text-xs font-medium">
                  {artist.popularity}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary Cards - Moved to bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
            className={`${card.gradient} rounded-xl p-6 border ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-spotify-dark/50`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-spotify-lightGray text-sm">{card.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummary;
