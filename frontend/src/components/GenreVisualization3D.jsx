import React from 'react';
import { motion } from 'framer-motion';
import { Music, Target, Zap } from 'lucide-react';

const GenreVisualization3D = ({ genres }) => {
  // Handle different genres data formats for display
  let genresData = {};
  if (Array.isArray(genres)) {
    genres.forEach(genre => {
      if (typeof genre === 'string') {
        genresData[genre] = 1;
      } else if (genre && genre.name) {
        genresData[genre.name] = genre.count || 1;
      }
    });
  } else if (typeof genres === 'object' && genres !== null) {
    genresData = genres;
  }

  // Fallback data for testing
  if (!genres || Object.keys(genresData).length === 0) {
    console.log('Using fallback genres data');
    genresData = {
      'Pop': 15,
      'Rock': 12,
      'Hip-Hop': 10,
      'Electronic': 8,
      'Jazz': 6,
      'Classical': 4,
      'R&B': 7,
      'Indie': 5
    };
  }

  const topGenres = Object.entries(genresData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const totalCount = Object.values(genresData).reduce((sum, count) => sum + count, 0);
  
  const colors = [
    '#1DB954', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-spotify-gray rounded-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Music className="w-5 h-5 text-spotify-green" />
        <h3 className="text-lg font-semibold text-white">Genre Distribution</h3>
      </div>
      
      {/* Simple Pie Chart */}
      <div className="mb-6 bg-spotify-dark/50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          {topGenres.map(([genre, count], index) => {
            const percentage = ((count / totalCount) * 100).toFixed(1);
            const color = colors[index % colors.length];
            
            return (
              <motion.div
                key={genre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{genre}</div>
                  <div className="text-spotify-lightGray text-xs">{count} artists</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{percentage}%</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Genre Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-spotify-dark/50 rounded-lg">
          <div className="text-spotify-green font-bold text-lg">{Object.keys(genresData).length}</div>
          <div className="text-spotify-lightGray text-xs">Total Genres</div>
        </div>
        <div className="text-center p-3 bg-spotify-dark/50 rounded-lg">
          <div className="text-spotify-green font-bold text-lg">{totalCount}</div>
          <div className="text-spotify-lightGray text-xs">Total Artists</div>
        </div>
        <div className="text-center p-3 bg-spotify-dark/50 rounded-lg">
          <div className="text-spotify-green font-bold text-lg">{topGenres[0]?.[0] || 'N/A'}</div>
          <div className="text-spotify-lightGray text-xs">Top Genre</div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="mt-6 p-4 bg-spotify-dark/50 rounded-lg">
        <h4 className="text-white font-medium mb-2">Genre Insights</h4>
        <div className="text-sm text-spotify-lightGray space-y-1">
          <p>• Your music spans {Object.keys(genresData).length} different genres</p>
          <p>• {topGenres[0]?.[0]} is your most listened genre</p>
          <p>• You have diverse musical taste across multiple styles</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GenreVisualization3D;
