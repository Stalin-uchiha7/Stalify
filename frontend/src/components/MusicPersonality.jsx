import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Target, Lightbulb, Award, TrendingUp } from 'lucide-react';

const MusicPersonality = ({ personality }) => {
  if (!personality) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading music personality...</p>
      </div>
    );
  }

  const getPersonalityIcon = (type) => {
    switch (type) {
      case 'Music Explorer':
        return <TrendingUp className="w-8 h-8 text-green-400" />;
      case 'Mainstream Lover':
        return <Star className="w-8 h-8 text-yellow-400" />;
      case 'Balanced Listener':
        return <Target className="w-8 h-8 text-blue-400" />;
      case 'Niche Enthusiast':
        return <Award className="w-8 h-8 text-purple-400" />;
      default:
        return <Brain className="w-8 h-8 text-spotify-green" />;
    }
  };

  const getPersonalityColor = (type) => {
    switch (type) {
      case 'Music Explorer':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'Mainstream Lover':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'Balanced Listener':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'Niche Enthusiast':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'from-spotify-green/20 to-green-500/20 border-spotify-green/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Personality Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-gradient-to-r ${getPersonalityColor(personality.type)} rounded-lg p-8 border`}
      >
        <div className="flex items-center space-x-4 mb-6">
          {getPersonalityIcon(personality.type)}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {personality.type}
            </h3>
            <p className="text-spotify-lightGray">
              {personality.description}
            </p>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="flex flex-wrap gap-2 mb-6">
          {personality.traits?.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 rounded-full text-white text-sm font-medium"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Personality Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(personality.score || {}).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {value}%
              </div>
              <div className="text-spotify-lightGray text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      {personality.recommendations && personality.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-spotify-gray rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
          </div>
          <div className="space-y-3">
            {personality.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-spotify-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-spotify-lightGray">{recommendation}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Personality Analysis</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Music Taste Profile</h4>
            <p className="text-spotify-lightGray text-sm">
              Based on your listening habits, you show characteristics of a {personality.type.toLowerCase()}. 
              Your music preferences reflect your personality traits and listening patterns.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Listening Behavior</h4>
            <p className="text-spotify-lightGray text-sm">
              Your music consumption patterns reveal insights about your daily routines, 
              mood preferences, and how you use music in different contexts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPersonality;
