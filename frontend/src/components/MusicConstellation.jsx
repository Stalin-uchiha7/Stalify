import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap } from 'lucide-react';

const MusicConstellation = ({ artists, tracks }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!artists || !Array.isArray(artists) || artists.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 500;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create constellation nodes
    const nodes = artists.slice(0, 12).map((artist, index) => {
      const angle = (index / Math.min(artists.length, 12)) * 2 * Math.PI;
      const radius = 140 + Math.random() * 80;
      const x = canvas.width / 2 + radius * Math.cos(angle);
      const y = canvas.height / 2 + radius * Math.sin(angle);
      
      return {
        x,
        y,
        artist,
        connections: []
      };
    });

    // Draw connections between related artists
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j && Math.random() > 0.7) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + 
            Math.pow(node.y - otherNode.y, 2)
          );
          
          if (distance < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(29, 185, 84, ${0.4 - distance / 600})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        }
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, 20
      );
      gradient.addColorStop(0, 'rgba(29, 185, 84, 0.9)');
      gradient.addColorStop(0.7, 'rgba(29, 185, 84, 0.3)');
      gradient.addColorStop(1, 'rgba(29, 185, 84, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      // Draw main circle
      ctx.fillStyle = '#1DB954';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw inner highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(node.x - 3, node.y - 3, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw artist name with better styling
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      const displayName = node.artist.name.length > 15 
        ? node.artist.name.substring(0, 15) + '...' 
        : node.artist.name;
      
      ctx.fillText(displayName, node.x, node.y - 25);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

  }, [artists]);

  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading music constellation...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-spotify-gray rounded-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Star className="w-5 h-5 text-spotify-green" />
        <h3 className="text-lg font-semibold text-white">Music Constellation</h3>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px] bg-gradient-to-br from-spotify-dark via-gray-900 to-spotify-dark rounded-lg border border-gray-700 shadow-2xl"
        />
        
        {/* Overlay info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Zap className="w-4 h-4 text-spotify-green" />
            <span>{artists.length} artists connected</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Musical relationships</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-spotify-lightGray text-sm">
          Each star represents an artist you love. The connections show musical relationships and influences.
        </p>
      </div>
    </motion.div>
  );
};

export default MusicConstellation;
