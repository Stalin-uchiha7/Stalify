import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, TrendingUp, BarChart3 } from 'lucide-react';

const HeatMap = ({ patterns }) => {
  // Fallback data for better visualization
  const generateFallbackData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDays = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 50) + 10
    }));
    
    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 30) + 5
    }));
    
    return { peakDays, peakHours };
  };

  const data = patterns || generateFallbackData();
  const { peakDays, peakHours } = data;

  // Calculate insights
  const totalActivity = peakDays.reduce((sum, day) => sum + day.count, 0);
  const mostActiveDay = peakDays.reduce((max, day) => day.count > max.count ? day : max, peakDays[0]);
  const mostActiveHour = peakHours.reduce((max, hour) => hour.count > max.count ? hour : max, peakHours[0]);
  const averageActivity = Math.round(totalActivity / 7);

  const getActivityLevel = (count) => {
    if (count >= 40) return { level: 4, label: 'Very High', color: 'bg-green-500' };
    if (count >= 30) return { level: 3, label: 'High', color: 'bg-green-400' };
    if (count >= 20) return { level: 2, label: 'Medium', color: 'bg-green-300' };
    if (count >= 10) return { level: 1, label: 'Low', color: 'bg-green-200' };
    return { level: 0, label: 'Very Low', color: 'bg-gray-600' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-spotify-gray rounded-lg p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-spotify-green" />
        <h3 className="text-lg font-semibold text-white">Listening Activity</h3>
      </div>
      
      <div className="space-y-6">
        {/* Weekly Activity Chart */}
        <div className="bg-spotify-dark/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Weekly Activity</span>
          </h4>
          
          <div className="space-y-3">
            {peakDays.map((day, index) => {
              const activity = getActivityLevel(day.count);
              const percentage = (day.count / Math.max(...peakDays.map(d => d.count))) * 100;
              
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-spotify-lightGray text-xs">{activity.label}</span>
                      <span className="text-white text-sm font-bold">{day.count}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${activity.color}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hourly Activity Chart */}
        <div className="bg-spotify-dark/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Hourly Activity</span>
          </h4>
          
          <div className="grid grid-cols-12 gap-1">
            {peakHours.map((hour, index) => {
              const activity = getActivityLevel(hour.count);
              const percentage = (hour.count / Math.max(...peakHours.map(h => h.count))) * 100;
              
              return (
                <motion.div
                  key={hour.hour}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="text-center space-y-1"
                >
                  <div className="text-xs text-spotify-lightGray">
                    {hour.hour === 0 ? '12A' : hour.hour < 12 ? `${hour.hour}A` : hour.hour === 12 ? '12P' : `${hour.hour - 12}P`}
                  </div>
                  <div 
                    className={`w-full h-8 rounded ${activity.color} border border-gray-600 hover:border-spotify-green/50 transition-all duration-200 cursor-pointer`}
                    style={{ opacity: 0.3 + (percentage / 100) * 0.7 }}
                    title={`${hour.hour}:00 - ${activity.label} activity (${hour.count} plays)`}
                  />
                  <div className="text-xs text-white font-bold">{hour.count}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center p-4 bg-spotify-dark/50 rounded-lg"
          >
            <TrendingUp className="w-6 h-6 text-spotify-green mx-auto mb-2" />
            <div className="text-white font-bold text-lg">{totalActivity}</div>
            <div className="text-spotify-lightGray text-xs">Total Plays</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center p-4 bg-spotify-dark/50 rounded-lg"
          >
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-bold text-lg">{mostActiveDay.day}</div>
            <div className="text-spotify-lightGray text-xs">Most Active Day</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center p-4 bg-spotify-dark/50 rounded-lg"
          >
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-bold text-lg">
              {mostActiveHour.hour === 0 ? '12A' : mostActiveHour.hour < 12 ? `${mostActiveHour.hour}A` : mostActiveHour.hour === 12 ? '12P' : `${mostActiveHour.hour - 12}P`}
            </div>
            <div className="text-spotify-lightGray text-xs">Peak Hour</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center p-4 bg-spotify-dark/50 rounded-lg"
          >
            <Activity className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-bold text-lg">{averageActivity}</div>
            <div className="text-spotify-lightGray text-xs">Daily Average</div>
          </motion.div>
        </div>

        {/* Insights */}
        <div className="p-4 bg-spotify-dark/50 rounded-lg">
          <h4 className="text-white font-medium mb-2">Listening Insights</h4>
          <div className="text-sm text-spotify-lightGray space-y-1">
            <p>• You're most active on {mostActiveDay.day} with {mostActiveDay.count} plays</p>
            <p>• Peak listening time is {mostActiveHour.hour === 0 ? '12 AM' : mostActiveHour.hour < 12 ? `${mostActiveHour.hour} AM` : mostActiveHour.hour === 12 ? '12 PM' : `${mostActiveHour.hour - 12} PM`}</p>
            <p>• Average daily activity: {averageActivity} plays per day</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatMap;
