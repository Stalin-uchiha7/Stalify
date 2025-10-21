import React from 'react';
import { motion } from 'framer-motion';
import { Users, ExternalLink } from 'lucide-react';

const ArtistCard = ({ artist, rank }) => {
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleViewProfile = () => {
    if (artist.external_urls?.spotify) {
      window.open(artist.external_urls.spotify, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="bg-spotify-gray rounded-lg p-6 hover:bg-gray-700 transition-colors group cursor-pointer"
      onClick={handleViewProfile}
    >
      {/* Rank Badge */}
      <div className="absolute -top-2 -right-2 bg-spotify-green text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {rank}
      </div>

      {/* Artist Image */}
      <div className="mb-4">
        <img
          src={artist.images?.[0]?.url || '/placeholder-artist.png'}
          alt={artist.name}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>

      {/* Artist Info */}
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-spotify-green transition-colors truncate">
          {artist.name}
        </h3>
        
        {/* Followers */}
        <div className="flex items-center justify-center space-x-1 text-spotify-lightGray text-sm mb-3">
          <Users className="w-4 h-4" />
          <span>{formatFollowers(artist.followers?.total || 0)} followers</span>
        </div>

        {/* Genres */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 justify-center">
            {artist.genres?.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-spotify-dark text-spotify-lightGray text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
            {artist.genres?.length > 3 && (
              <span className="px-2 py-1 bg-spotify-dark text-spotify-lightGray text-xs rounded-full">
                +{artist.genres.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Popularity */}
        <div className="mb-4">
          <div className="text-xs text-spotify-lightGray mb-1">Popularity</div>
          <div className="w-full bg-spotify-dark rounded-full h-2">
            <div
              className="bg-spotify-green h-2 rounded-full transition-all duration-500"
              style={{ width: `${artist.popularity || 0}%` }}
            ></div>
          </div>
          <div className="text-xs text-spotify-lightGray mt-1">
            {artist.popularity || 0}%
          </div>
        </div>

        {/* External Link */}
        {artist.external_urls?.spotify && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(artist.external_urls.spotify, '_blank');
            }}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-spotify-green text-white text-sm rounded-full hover:bg-green-500 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>View on Spotify</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ArtistCard;
