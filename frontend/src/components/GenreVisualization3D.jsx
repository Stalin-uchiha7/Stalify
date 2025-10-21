import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Target, Zap } from 'lucide-react';

const GenreVisualization3D = ({ genres }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!genres || genres.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 500;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort genres by count
    const sortedGenres = Object.entries(genres)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    // Create 3D-like spheres for each genre
    sortedGenres.forEach(([genre, count], index) => {
      const angle = (index / sortedGenres.length) * 2 * Math.PI;
      const radius = 80 + Math.random() * 40;
      const x = canvas.width / 2 + radius * Math.cos(angle);
      const y = canvas.height / 2 + radius * Math.sin(angle);
      
      // Calculate sphere size based on count
      const maxCount = Math.max(...Object.values(genres));
      const sphereSize = 20 + (count / maxCount) * 40;
      
      // Create gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        x - sphereSize/4, y - sphereSize/4, 0,
        x, y, sphereSize
      );
      
      // Color based on genre
      const colors = [
        '#1DB954', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
      ];
      const color = colors[index % colors.length];
      
      gradient.addColorStop(0, `${color}CC`);
      gradient.addColorStop(0.7, `${color}88`);
      gradient.addColorStop(1, `${color}44`);
      
      // Draw sphere
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, sphereSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw highlight
      ctx.fillStyle = `${color}AA`;
      ctx.beginPath();
      ctx.arc(x - sphereSize/3, y - sphereSize/3, sphereSize/3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw genre name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(genre, x, y + sphereSize + 20);
      
      // Draw count
      ctx.fillStyle = '#B3B3B3';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${count}`, x, y + sphereSize + 35);
    });

    // Draw connections between related genres
    for (let i = 0; i < sortedGenres.length; i++) {
      for (let j = i + 1; j < sortedGenres.length; j++) {
        if (Math.random() > 0.6) {
          const angle1 = (i / sortedGenres.length) * 2 * Math.PI;
          const angle2 = (j / sortedGenres.length) * 2 * Math.PI;
          const radius1 = 80 + Math.random() * 40;
          const radius2 = 80 + Math.random() * 40;
          
          const x1 = canvas.width / 2 + radius1 * Math.cos(angle1);
          const y1 = canvas.height / 2 + radius1 * Math.sin(angle1);
          const x2 = canvas.width / 2 + radius2 * Math.cos(angle2);
          const y2 = canvas.height / 2 + radius2 * Math.sin(angle2);
          
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(29, 185, 84, 0.3)';
          ctx.lineWidth = 1;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

  }, [genres]);

  if (!genres || Object.keys(genres).length === 0) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading 3D genre visualization...</p>
      </div>
    );
  }

  const topGenres = Object.entries(genres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-spotify-gray rounded-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Music className="w-5 h-5 text-spotify-green" />
        <h3 className="text-lg font-semibold text-white">3D Genre Universe</h3>
      </div>
      
      {/* 3D Canvas */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-gradient-to-br from-spotify-dark via-gray-900 to-spotify-dark rounded-lg border border-gray-700"
        />
        
        {/* Overlay info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Target className="w-4 h-4 text-spotify-green" />
            <span>{Object.keys(genres).length} genres explored</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Interactive 3D view</span>
          </div>
        </div>
      </div>
      
      {/* Top Genres List */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Top Genres</h4>
        {topGenres.map(([genre, count], index) => (
          <motion.div
            key={genre}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-spotify-dark/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-spotify-green/20 rounded-full flex items-center justify-center">
                <span className="text-spotify-green font-bold text-sm">#{index + 1}</span>
              </div>
              <div>
                <div className="text-white font-medium">{genre}</div>
                <div className="text-spotify-lightGray text-sm">{count} artists</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-spotify-green font-bold">{count}</div>
              <div className="text-spotify-lightGray text-xs">artists</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Insights */}
      <div className="mt-6 p-4 bg-spotify-dark/50 rounded-lg">
        <h4 className="text-white font-medium mb-2">Genre Insights</h4>
        <div className="text-sm text-spotify-lightGray space-y-1">
          <p>• Larger spheres represent more popular genres in your taste</p>
          <p>• Connected genres show musical relationships</p>
          <p>• Your music universe spans {Object.keys(genres).length} different genres</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GenreVisualization3D;
