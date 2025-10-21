import React from 'react';
import { motion } from 'framer-motion';
import { Music, BarChart3, Heart, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-spotify-dark">
      {/* Header */}
      <header className="bg-spotify-gray border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/login" className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-spotify-green" />
              <span className="text-xl font-bold text-white">Stalify</span>
            </Link>
            <Link 
              to="/login"
              className="px-4 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Your Spotify Stats,{' '}
              <span className="text-spotify-green">Amplified</span>
            </h1>
            <p className="text-xl text-spotify-lightGray mb-8 max-w-2xl mx-auto">
              Discover your unique music taste and listening habits with beautiful visualizations 
              and personalized insights powered by your Spotify data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Features</h2>
            <p className="text-spotify-lightGray">Everything you need to understand your music taste</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Visual Analytics",
                description: "Beautiful charts and graphs showing your top tracks, artists, and genre preferences."
              },
              {
                icon: <Music className="w-8 h-8" />,
                title: "Music Insights",
                description: "Discover patterns in your listening habits and get personalized music recommendations."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Your Vibe",
                description: "AI-powered insights about your music taste and mood patterns throughout different time periods."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-spotify-gray rounded-xl p-6 text-center hover:bg-gray-800 transition-colors"
              >
                <div className="text-spotify-green mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-spotify-lightGray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-spotify-gray">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Built With</h2>
            <p className="text-spotify-lightGray">Modern technologies for the best experience</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'React', 'Vite', 'TailwindCSS', 'Node.js',
              'Express', 'Spotify API', 'MongoDB', 'Vercel'
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-spotify-dark rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-white font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center space-x-6">
              <a 
                href="https://github.com/your-username/stalify" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-spotify-lightGray hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-spotify-lightGray text-sm">
              Made with ❤️ and 🎵 by [Your Name]
            </p>
            <p className="text-spotify-lightGray text-xs">
              This project is not affiliated with Spotify AB.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default About;
