import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Zap, Heart, Gauge } from 'lucide-react';

const SoundWaveVisualization = ({ audioFeatures }) => {
  // Fallback data
  if (!audioFeatures || !audioFeatures.average) {
    console.log('Using fallback audioFeatures data');
    audioFeatures = {
      average: {
        danceability: 75,
        energy: 65,
        valence: 70,
        tempo: 120
      },
      insights: [
        'Your music has high danceability',
        'Moderate energy levels',
        'Generally positive mood'
      ]
    };
  }

  const features = [
    { 
      name: 'Danceability', 
      value: audioFeatures.average.danceability, 
      icon: Volume2, 
      color: 'bg-green-500',
      description: 'How suitable for dancing'
    },
    { 
      name: 'Energy', 
      value: audioFeatures.average.energy, 
      icon: Zap, 
      color: 'bg-red-500',
      description: 'Intensity and power'
    },
    { 
      name: 'Valence', 
      value: audioFeatures.average.valence, 
      icon: Heart, 
      color: 'bg-blue-500',
      description: 'Musical positivity'
    },
    { 
      name: 'Tempo', 
      value: audioFeatures.average.tempo, 
      icon: Gauge, 
      color: 'bg-purple-500',
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
        <h3 className="text-lg font-semibold text-white">Audio Features Chart</h3>
      </div>
      
      {/* Simple Bar Chart */}
      <div className="mb-6 bg-spotify-dark/50 rounded-lg p-4">
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const percentage = feature.name === 'Tempo' ? Math.min(feature.value / 2, 100) : feature.value;
            
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{feature.name}</span>
                  </div>
                  <span className="text-white text-sm font-bold">
                    {feature.name === 'Tempo' ? `${feature.value} BPM` : `${feature.value}%`}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-3 rounded-full ${feature.color}`}
                  />
                </div>
                
                <div className="text-xs text-spotify-lightGray">
                  {feature.description}
                </div>
              </motion.div>
            );
          })}
        </div>
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
