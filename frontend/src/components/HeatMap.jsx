import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity } from 'lucide-react';

const HeatMap = ({ patterns }) => {
  if (!patterns || (!patterns.peakHours && !patterns.peakDays)) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">Loading heat map...</p>
      </div>
    );
  }

  // Generate heat map data
  const generateHeatMapData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Create a 7x24 grid
    const heatMapData = [];
    
    for (let day = 0; day < 7; day++) {
      const dayRow = [];
      for (let hour = 0; hour < 24; hour++) {
        // Find if this hour/day combination has data
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
        const dayData = patterns.peakDays?.find(d => d.day === dayName);
        const hourData = patterns.peakHours?.find(h => h.hour === hour);
        
        let intensity = 0;
        if (dayData && hourData) {
          intensity = Math.min(4, Math.floor((dayData.count + hourData.count) / 20));
        } else if (dayData) {
          intensity = Math.min(3, Math.floor(dayData.count / 30));
        } else if (hourData) {
          intensity = Math.min(3, Math.floor(hourData.count / 10));
        }
        
        dayRow.push({
          day,
          hour,
          intensity,
          dayName,
          hourLabel: hour < 12 ? `${hour} AM` : `${hour === 12 ? 12 : hour - 12} PM`
        });
      }
      heatMapData.push(dayRow);
    }
    
    return { heatMapData, days, hours };
  };

  const { heatMapData, days, hours } = generateHeatMapData();

  const getIntensityColor = (intensity) => {
    const colors = [
      'bg-gray-800', // 0 - no activity
      'bg-spotify-green/20', // 1 - low activity
      'bg-spotify-green/40', // 2 - medium activity
      'bg-spotify-green/60', // 3 - high activity
      'bg-spotify-green' // 4 - very high activity
    ];
    return colors[intensity] || colors[0];
  };

  const getIntensityLabel = (intensity) => {
    const labels = [
      'No activity',
      'Low activity',
      'Medium activity',
      'High activity',
      'Very high activity'
    ];
    return labels[intensity] || labels[0];
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
        <h3 className="text-lg font-semibold text-white">Listening Activity Heat Map</h3>
      </div>
      
      <div className="space-y-4">
        {/* Heat Map Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Hour labels */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {hours.map((hour) => (
                <div key={hour} className="w-8 text-center text-xs text-spotify-lightGray">
                  {hour % 4 === 0 ? hour : ''}
                </div>
              ))}
            </div>
            
            {/* Heat map grid */}
            {heatMapData.map((dayRow, dayIndex) => (
              <div key={dayIndex} className="flex mb-1">
                {/* Day label */}
                <div className="w-12 text-xs text-spotify-lightGray flex items-center justify-end pr-2">
                  {days[dayIndex]}
                </div>
                
                {/* Hour cells */}
                {dayRow.map((cell, hourIndex) => (
                  <motion.div
                    key={`${dayIndex}-${hourIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (dayIndex * 24 + hourIndex) * 0.01 
                    }}
                    className={`w-8 h-8 ${getIntensityColor(cell.intensity)} border border-gray-700 hover:border-spotify-green/50 transition-all duration-200 cursor-pointer`}
                    title={`${cell.dayName} ${cell.hourLabel} - ${getIntensityLabel(cell.intensity)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-spotify-lightGray">Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div
                  key={intensity}
                  className={`w-4 h-4 ${getIntensityColor(intensity)} border border-gray-700`}
                />
              ))}
            </div>
            <span className="text-sm text-spotify-lightGray">More</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-spotify-lightGray">
            <Activity className="w-4 h-4" />
            <span>Activity level</span>
          </div>
        </div>
        
        {/* Insights */}
        <div className="mt-4 p-4 bg-spotify-dark/50 rounded-lg">
          <h4 className="text-white font-medium mb-2">Insights</h4>
          <div className="text-sm text-spotify-lightGray space-y-1">
            <p>• Darker squares indicate higher listening activity</p>
            <p>• Hover over squares to see specific times and activity levels</p>
            <p>• Patterns show your most active listening periods</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatMap;
