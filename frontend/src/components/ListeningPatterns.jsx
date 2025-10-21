import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Repeat, TrendingUp, BarChart3, SkipForward, Timer, Activity, Zap } from 'lucide-react';

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

  const getTimeOfDay = (hour) => {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const getListeningInsight = () => {
    if (!patterns.peakHours || patterns.peakHours.length === 0) return '';
    
    const topHour = patterns.peakHours[0];
    const timeOfDay = getTimeOfDay(topHour.hour);
    
    if (timeOfDay === 'Morning') return "You're a morning music lover! 🌅";
    if (timeOfDay === 'Afternoon') return "Music fuels your afternoons! ☀️";
    if (timeOfDay === 'Evening') return "Evening vibes are your thing! 🌆";
    return "Night owl music sessions! 🌙";
  };

  const getDiscoveryInsight = () => {
    if (patterns.discoveryRate > 70) return "You're a true music explorer! 🎵";
    if (patterns.discoveryRate > 40) return "You balance discovery with favorites! ⚖️";
    return "You love your comfort music! 💚";
  };

  const getRepeatInsight = () => {
    if (patterns.repeatRate > 50) return "You love replaying your favorites! 🔄";
    if (patterns.repeatRate > 20) return "You enjoy some repetition! 🎶";
    return "Always something new for you! ✨";
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-spotify-green" />
            <h3 className="text-lg font-semibold text-white">Peak Listening Hours</h3>
          </div>
          <div className="text-sm text-spotify-lightGray">
            {getListeningInsight()}
          </div>
        </div>
        
        <div className="space-y-4">
          {patterns.peakHours?.map((peak, index) => {
            const maxCount = Math.max(...patterns.peakHours.map(p => p.count));
            const percentage = (peak.count / maxCount) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-spotify-green/20 rounded-full flex items-center justify-center">
                      <span className="text-spotify-green font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {getHourLabel(peak.hour)}
                      </div>
                      <div className="text-xs text-spotify-lightGray">
                        {getTimeOfDay(peak.hour)} • {peak.count} plays
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-spotify-green">
                      {peak.count} plays
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="bg-gradient-to-r from-spotify-green to-green-400 h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            );
          })}
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
          {patterns.peakDays?.map((day, index) => {
            const maxCount = Math.max(...patterns.peakDays.map(d => d.count));
            const percentage = (day.count / maxCount) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{day.day}</div>
                      <div className="text-xs text-spotify-lightGray">
                        {day.count} plays • {percentage.toFixed(0)}% of peak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-400">
                      {day.count} plays
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 + (index * 0.2) }}
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                  ></motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Listening Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Repeat Rate */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <Repeat className="w-8 h-8 text-spotify-green mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.repeatRate}%
          </div>
          <div className="text-spotify-lightGray text-sm mb-2">
            Repeat Rate
          </div>
          <div className="text-xs text-spotify-lightGray">
            {getRepeatInsight()}
          </div>
        </div>

        {/* Discovery Rate */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.discoveryRate}%
          </div>
          <div className="text-spotify-lightGray text-sm mb-2">
            Discovery Rate
          </div>
          <div className="text-xs text-spotify-lightGray">
            {getDiscoveryInsight()}
          </div>
        </div>

        {/* Skip Rate */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <SkipForward className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.skipRate}%
          </div>
          <div className="text-spotify-lightGray text-sm mb-2">
            Skip Rate
          </div>
          <div className="text-xs text-spotify-lightGray">
            Songs you skip before finishing
          </div>
        </div>

        {/* Listening Streak */}
        <div className="bg-spotify-gray rounded-lg p-6 text-center">
          <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {patterns.listeningStreak}
          </div>
          <div className="text-spotify-lightGray text-sm mb-2">
            Day Streak
          </div>
          <div className="text-xs text-spotify-lightGray">
            {patterns.listeningStreak > 0 ? "Keep the music going! 🔥" : "Start your streak today! 🎵"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ListeningPatterns;
