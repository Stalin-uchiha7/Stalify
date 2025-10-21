import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useSpotifyPlayer from '../hooks/useSpotifyPlayer';
import { useApiWithRefresh } from '../hooks/useApiWithRefresh';

const TrackCard = ({ track, rank }) => {
  const { accessToken } = useAuth();
  const { makeRequest } = useApiWithRefresh();
  const { isReady, isPlaying, currentTrack, playTrack, togglePlayback } = useSpotifyPlayer(accessToken);
  
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (isReady && track.uri) {
      // If this track is currently playing, toggle playback
      if (currentTrack?.id === track.id) {
        togglePlayback();
      } else {
        // Play this track
        playTrack(track.uri);
      }
    } else if (track.external_urls?.spotify) {
      // Fallback to opening in Spotify
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-colors group ${
        isCurrentTrack 
          ? 'bg-spotify-green/20 border border-spotify-green/30' 
          : 'bg-spotify-gray hover:bg-gray-700'
      }`}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-spotify-lightGray font-semibold">#{rank}</span>
      </div>

      {/* Album Art */}
      <div className="flex-shrink-0 relative">
        <img
          src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
          alt={track.album?.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
        />
        {isCurrentTrack && (
          <div className="absolute inset-0 bg-spotify-green/20 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate transition-colors text-sm sm:text-base ${
          isCurrentTrack ? 'text-spotify-green' : 'text-white group-hover:text-spotify-green'
        }`}>
          {track.name}
        </h3>
        <p className="text-spotify-lightGray text-xs sm:text-sm truncate">
          {track.artists?.map(artist => artist.name).join(', ')}
        </p>
        <p className="text-spotify-lightGray text-xs truncate">
          {track.album?.name}
        </p>
      </div>

      {/* Duration */}
      <div className="flex-shrink-0 text-spotify-lightGray text-xs sm:text-sm hidden sm:block">
        {formatDuration(track.duration_ms)}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlay}
          className={`p-2 transition-colors ${
            isTrackPlaying 
              ? 'text-spotify-green' 
              : 'text-spotify-lightGray hover:text-spotify-green'
          }`}
          title={isReady ? (isTrackPlaying ? 'Pause' : 'Play') : 'Open in Spotify'}
        >
          {isTrackPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </motion.button>
        {track.external_urls?.spotify && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(track.external_urls.spotify, '_blank')}
            className="p-2 text-spotify-lightGray hover:text-spotify-green transition-colors"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TrackCard;
