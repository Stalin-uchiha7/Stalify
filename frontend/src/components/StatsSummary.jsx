import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, TrendingUp, Clock, Award, Heart } from 'lucide-react';

const StatsSummary = ({ stats }) => {
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
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Users,
      title: 'Top Artists Analyzed',
      value: stats.summary?.totalArtistsAnalyzed || 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: TrendingUp,
      title: 'Unique Genres',
      value: stats.summary?.totalGenres || 0,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Award,
      title: 'Top Genre',
      value: stats.summary?.topGenre || 'Unknown',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  const topTracks = stats.topTracks?.mediumTerm?.items?.slice(0, 5) || [];
  const topArtists = stats.topArtists?.mediumTerm?.items?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-700`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-spotify-dark`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-spotify-lightGray text-sm">{card.title}</p>
                <p className="text-white text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Tracks Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-spotify-gray rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Music className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Your Top Tracks</h3>
          </div>
          <div className="space-y-3">
            {topTracks.map((track, index) => (
              <div key={track.id} className="flex items-center space-x-3">
                <span className="text-spotify-lightGray text-sm font-medium w-6">
                  #{index + 1}
                </span>
                <img
                  src={track.album?.images?.[0]?.url}
                  alt={track.album?.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {track.name}
                  </p>
                  <p className="text-spotify-lightGray text-xs truncate">
                    {track.artists?.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Artists Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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

      {/* Your Vibe Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-spotify-green/20 to-blue-500/20 rounded-lg p-8 border border-spotify-green/30"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-6 h-6 text-spotify-green" />
          <h3 className="text-xl font-semibold text-white">Your Music Vibe</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};

export default StatsSummary;
