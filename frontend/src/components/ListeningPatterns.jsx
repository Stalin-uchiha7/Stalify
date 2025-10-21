import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Repeat, TrendingUp, BarChart3 } from 'lucide-react';

const ListeningPatterns = ({ patterns }) => {
  if (!patterns) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading listening patterns...</p>
      </div>
    );
  }

  const getDayName = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || day;
  };

  const getHourLabel = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="space-y-6">
      {/* Peak Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-spotify-green" />
          <h3 className="text-lg font-semibold text-white">Peak Listening Hours</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {patterns.peakHours?.map((peak, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-spotify-green mb-1">
                {getHourLabel(peak.hour)}
              </div>
              <div className="text-spotify-lightGray text-sm">
                {peak.count} plays
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Peak Days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-spotify-green" />
          <h3 className="text-lg font-semibold text-white">Peak Listening Days</h3>
        </div>
        <div className="space-y-3">
          {patterns.peakDays?.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white font-medium">{day.day}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-spotify-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(day.count / Math.max(...patterns.peakDays.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-spotify-lightGray text-sm w-12 text-right">
                  {day.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Listening Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Repeat Rate */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <Repeat className="w-8 h-8 text-spotify-green mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.repeatRate}%
          </div>
          <div className="text-spotify-lightGray text-sm">
            Repeat Rate
          </div>
          <div className="text-xs text-spotify-lightGray mt-2">
            Songs you play multiple times
          </div>
        </div>

        {/* Discovery Rate */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.discoveryRate}%
          </div>
          <div className="text-spotify-lightGray text-sm">
            Discovery Rate
          </div>
          <div className="text-xs text-spotify-lightGray mt-2">
            New vs familiar music
          </div>
        </div>

        {/* Listening Streak */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.listeningStreak}
          </div>
          <div className="text-spotify-lightGray text-sm">
            Day Streak
          </div>
          <div className="text-xs text-spotify-lightGray mt-2">
            Consecutive listening days
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ListeningPatterns;
