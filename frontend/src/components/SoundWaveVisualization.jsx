import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Zap, Heart, Gauge } from 'lucide-react';

const SoundWaveVisualization = ({ audioFeatures }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioFeatures || !audioFeatures.average) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Audio features data
    const features = [
      { name: 'Danceability', value: audioFeatures.average.danceability / 100, color: '#1DB954' },
      { name: 'Energy', value: audioFeatures.average.energy / 100, color: '#FF6B6B' },
      { name: 'Valence', value: audioFeatures.average.valence / 100, color: '#4ECDC4' },
      { name: 'Tempo', value: Math.min(audioFeatures.average.tempo / 200, 1), color: '#45B7D1' }
    ];

    // Draw sound waves for each feature
    features.forEach((feature, featureIndex) => {
      const y = 50 + featureIndex * 50;
      const amplitude = feature.value * 30;
      const frequency = 0.02 + feature.value * 0.03;
      
      // Draw wave
      ctx.beginPath();
      ctx.strokeStyle = feature.color;
      ctx.lineWidth = 2;
      
      for (let x = 0; x < canvas.width; x += 2) {
        const waveY = y + Math.sin(x * frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      
      ctx.stroke();
      
      // Draw feature label
      ctx.fillStyle = feature.color;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(feature.name, 10, y - 10);
      
      // Draw value
      ctx.fillText(`${Math.round(feature.value * 100)}%`, canvas.width - 50, y - 10);
    });

    // Draw frequency bars
    const barCount = 32;
    const barWidth = canvas.width / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * 100 + 20;
      const hue = (i / barCount) * 360;
      
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(
        i * barWidth, 
        canvas.height - barHeight, 
        barWidth - 2, 
        barHeight
      );
    }

  }, [audioFeatures]);

  if (!audioFeatures || !audioFeatures.average) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading sound wave visualization...</p>
      </div>
    );
  }

  const features = [
    { 
      name: 'Danceability', 
      value: audioFeatures.average.danceability, 
      icon: Volume2, 
      color: 'text-green-400',
      description: 'How suitable for dancing'
    },
    { 
      name: 'Energy', 
      value: audioFeatures.average.energy, 
      icon: Zap, 
      color: 'text-red-400',
      description: 'Intensity and power'
    },
    { 
      name: 'Valence', 
      value: audioFeatures.average.valence, 
      icon: Heart, 
      color: 'text-blue-400',
      description: 'Musical positivity'
    },
    { 
      name: 'Tempo', 
      value: audioFeatures.average.tempo, 
      icon: Gauge, 
      color: 'text-purple-400',
      description: 'Beats per minute'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-spotify-gray rounded-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Volume2 className="w-5 h-5 text-spotify-green" />
        <h3 className="text-lg font-semibold text-white">Sound Wave Visualization</h3>
      </div>
      
      {/* Canvas */}
      <div className="mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-48 bg-gradient-to-r from-spotify-dark to-gray-900 rounded-lg border border-gray-700"
        />
      </div>
      
      {/* Feature breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div className={`text-lg font-bold ${feature.color} mb-1`}>
                {feature.name === 'Tempo' ? `${feature.value} BPM` : `${feature.value}%`}
              </div>
              <div className="text-xs text-spotify-lightGray">
                {feature.description}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Insights */}
      {audioFeatures.insights && audioFeatures.insights.length > 0 && (
        <div className="mt-6 p-4 bg-spotify-dark/50 rounded-lg">
          <h4 className="text-white font-medium mb-2">Audio Insights</h4>
          <div className="space-y-2">
            {audioFeatures.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-2 text-sm text-spotify-lightGray"
              >
                <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                <span>{insight}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SoundWaveVisualization;
