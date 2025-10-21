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
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create constellation nodes
    const nodes = artists.slice(0, 8).map((artist, index) => {
      const angle = (index / artists.length) * 2 * Math.PI;
      const radius = 120 + Math.random() * 60;
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
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(29, 185, 84, ${0.3 - distance / 500})`;
            ctx.lineWidth = 1;
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
        node.x, node.y, 15
      );
      gradient.addColorStop(0, 'rgba(29, 185, 84, 0.8)');
      gradient.addColorStop(1, 'rgba(29, 185, 84, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      ctx.fill();

      // Draw main circle
      ctx.fillStyle = '#1DB954';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw artist name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        node.artist.name.length > 12 
          ? node.artist.name.substring(0, 12) + '...' 
          : node.artist.name, 
        node.x, 
        node.y - 20
      );
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
          className="w-full h-96 bg-gradient-to-br from-spotify-dark to-gray-900 rounded-lg border border-gray-700"
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
