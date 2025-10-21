import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const GenreChart = ({ genres }) => {
  if (!genres || genres.length === 0) {
    return (
      <div className="bg-spotify-gray rounded-lg p-8 text-center">
        <p className="text-spotify-lightGray">No genre data available</p>
      </div>
    );
  }

  // Colors for the pie chart
  const COLORS = [
    '#1DB954', '#1ed760', '#1aa34a', '#168f3e', '#137b32',
    '#0f6726', '#0b531a', '#073f0e', '#032b02', '#001700'
  ];

  // Prepare data for charts
  const pieData = genres.slice(0, 10).map((genre, index) => ({
    name: genre.genre,
    value: genre.count,
    color: COLORS[index % COLORS.length]
  }));

  const barData = genres.slice(0, 15).map(genre => ({
    genre: genre.genre.length > 15 ? genre.genre.substring(0, 15) + '...' : genre.genre,
    count: genre.count
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-spotify-gray border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-spotify-green">
            {`Count: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Genre Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Top Genres</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="genre" 
                stroke="#B3B3B3"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#B3B3B3" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#1DB954" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Genre List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-spotify-gray rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">All Genres</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-spotify-dark rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-white text-sm font-medium truncate">
                {genre.genre}
              </span>
              <span className="text-spotify-green text-sm font-semibold">
                {genre.count}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GenreChart;
