import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

const TrackCard = ({ track, rank }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-4 p-4 bg-spotify-gray rounded-lg hover:bg-gray-700 transition-colors group"
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-spotify-lightGray font-semibold">#{rank}</span>
      </div>

      {/* Album Art */}
      <div className="flex-shrink-0">
        <img
          src={track.album?.images?.[0]?.url || '/placeholder-album.png'}
          alt={track.album?.name}
          className="w-12 h-12 rounded object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate group-hover:text-spotify-green transition-colors">
          {track.name}
        </h3>
        <p className="text-spotify-lightGray text-sm truncate">
          {track.artists?.map(artist => artist.name).join(', ')}
        </p>
        <p className="text-spotify-lightGray text-xs truncate">
          {track.album?.name}
        </p>
      </div>

      {/* Duration */}
      <div className="flex-shrink-0 text-spotify-lightGray text-sm">
        {formatDuration(track.duration_ms)}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlay}
          className="p-2 text-spotify-lightGray hover:text-spotify-green transition-colors"
        >
          <Play className="w-4 h-4" />
        </motion.button>
        {track.external_urls?.spotify && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(track.external_urls.spotify, '_blank')}
            className="p-2 text-spotify-lightGray hover:text-spotify-green transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TrackCard;
