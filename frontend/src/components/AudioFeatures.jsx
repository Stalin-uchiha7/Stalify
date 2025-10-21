import React from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Heart, Gauge, Volume2, Activity } from 'lucide-react';

const AudioFeatures = ({ features }) => {
  if (!features) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading audio features...</p>
      </div>
    );
  }

  const featureData = [
    {
      key: 'danceability',
      label: 'Danceability',
      icon: Music,
      color: 'text-green-400',
      description: 'How suitable a track is for dancing'
    },
    {
      key: 'energy',
      label: 'Energy',
      icon: Zap,
      color: 'text-yellow-400',
      description: 'Perceptual measure of intensity and power'
    },
    {
      key: 'valence',
      label: 'Valence',
      icon: Heart,
      color: 'text-pink-400',
      description: 'Musical positivity conveyed by a track'
    },
    {
      key: 'tempo',
      label: 'Tempo',
      icon: Gauge,
      color: 'text-blue-400',
      description: 'Overall estimated tempo in BPM'
    }
  ];

  const getFeatureLevel = (value, key) => {
    if (key === 'tempo') {
      if (value < 80) return 'Slow';
      if (value < 120) return 'Moderate';
      if (value < 160) return 'Fast';
      return 'Very Fast';
    }
    
    if (value < 30) return 'Low';
    if (value < 70) return 'Medium';
    return 'High';
  };

  const getFeatureColor = (value, key) => {
    if (key === 'tempo') {
      if (value < 80) return 'bg-red-500';
      if (value < 120) return 'bg-yellow-500';
      if (value < 160) return 'bg-green-500';
      return 'bg-blue-500';
    }
    
    if (value < 30) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Audio Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Volume2 className="w-5 h-5 text-spotify-green" />
          <h3 className="text-lg font-semibold text-white">Audio Features Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureData.map((feature) => {
            const value = features.average?.[feature.key] || 0;
            const Icon = feature.icon;
            
            return (
              <div key={feature.key} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {feature.key === 'tempo' ? value : `${value}%`}
                </div>
                <div className="text-spotify-lightGray text-sm mb-2">
                  {feature.label}
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getFeatureColor(value, feature.key)} text-white`}>
                  {getFeatureLevel(value, feature.key)}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Feature Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Feature Breakdown</h3>
        <div className="space-y-4">
          {featureData.map((feature) => {
            const value = features.average?.[feature.key] || 0;
            const Icon = feature.icon;
            
            return (
              <div key={feature.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-white font-medium">{feature.label}</span>
                  </div>
                  <span className="text-spotify-lightGray text-sm">
                    {feature.key === 'tempo' ? `${value} BPM` : `${value}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.key === 'tempo' ? Math.min((value / 200) * 100, 100) : value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-2 rounded-full ${getFeatureColor(value, feature.key)}`}
                  ></motion.div>
                </div>
                <p className="text-spotify-lightGray text-xs">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Insights */}
      {features.insights && features.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-spotify-gray rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Music Insights</h3>
          </div>
          <div className="space-y-3">
            {features.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-spotify-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-spotify-lightGray">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AudioFeatures;
