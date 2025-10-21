const express = require('express');
const spotifyAPI = require('../utils/spotifyAPI');

const router = express.Router();

// Middleware to verify access token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  req.accessToken = authHeader.split(' ')[1];
  next();
};

// GET /api/analytics/listening-patterns - Get detailed listening patterns
router.get('/listening-patterns', verifyToken, async (req, res) => {
  try {
    const accessToken = req.accessToken;
    
    // Get recently played tracks for pattern analysis
    const recentlyPlayed = await spotifyAPI.getRecentlyPlayed(accessToken, 50);
    
    // Analyze listening patterns
    const patterns = analyzeListeningPatterns(recentlyPlayed);
    
    res.json({
      success: true,
      data: patterns
    });

  } catch (error) {
    console.error('Listening patterns error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch listening patterns',
      message: error.message 
    });
  }
});

// GET /api/analytics/music-personality - Get music personality analysis
router.get('/music-personality', verifyToken, async (req, res) => {
  try {
    const accessToken = req.accessToken;
    
    // Get top tracks and artists for personality analysis
    const [topTracks, topArtists] = await Promise.all([
      spotifyAPI.getTopTracks(accessToken, 'medium_term', 50),
      spotifyAPI.getTopArtists(accessToken, 'medium_term', 50)
    ]);
    
    // Analyze music personality
    const personality = analyzeMusicPersonality(topTracks, topArtists);
    
    res.json({
      success: true,
      data: personality
    });

  } catch (error) {
    console.error('Music personality error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze music personality',
      message: error.message 
    });
  }
});

// GET /api/analytics/audio-features - Get audio features analysis
router.get('/audio-features', verifyToken, async (req, res) => {
  try {
    const accessToken = req.accessToken;
    
    // Get top tracks
    const topTracks = await spotifyAPI.getTopTracks(accessToken, 'medium_term', 50);
    const trackIds = topTracks.items.map(track => track.id);
    
    // Get audio features
    const audioFeatures = await spotifyAPI.getAudioFeatures(accessToken, trackIds);
    
    // Analyze audio features
    const features = analyzeAudioFeatures(audioFeatures);
    
    res.json({
      success: true,
      data: features
    });

  } catch (error) {
    console.error('Audio features error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze audio features',
      message: error.message 
    });
  }
});

// Helper function to analyze listening patterns
function analyzeListeningPatterns(recentlyPlayed) {
  const patterns = {
    peakHours: {},
    peakDays: {},
    skipRate: 0,
    repeatRate: 0,
    discoveryRate: 0,
    listeningStreak: 0
  };

  const trackCounts = {};
  const hourCounts = {};
  const dayCounts = {};
  let totalPlays = 0;
  let uniqueTracks = 0;

  recentlyPlayed.items.forEach(item => {
    const playedAt = new Date(item.played_at);
    const hour = playedAt.getHours();
    const day = playedAt.getDay();
    
    // Count plays by hour
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    
    // Count plays by day
    dayCounts[day] = (dayCounts[day] || 0) + 1;
    
    // Track repeat behavior
    const trackId = item.track.id;
    trackCounts[trackId] = (trackCounts[trackId] || 0) + 1;
    totalPlays++;
  });

  // Calculate patterns
  patterns.peakHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));

  patterns.peakDays = Object.entries(dayCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([day, count]) => ({ 
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day], 
      count 
    }));

  uniqueTracks = Object.keys(trackCounts).length;
  patterns.repeatRate = Math.round(((totalPlays - uniqueTracks) / totalPlays) * 100);
  patterns.discoveryRate = Math.round((uniqueTracks / totalPlays) * 100);

  return patterns;
}

// Helper function to analyze music personality
function analyzeMusicPersonality(topTracks, topArtists) {
  const personality = {
    type: '',
    traits: [],
    score: {},
    description: '',
    recommendations: []
  };

  // Analyze genre diversity
  const genres = {};
  topArtists.items.forEach(artist => {
    artist.genres.forEach(genre => {
      genres[genre] = (genres[genre] || 0) + 1;
    });
  });

  const genreCount = Object.keys(genres).length;
  const totalArtists = topArtists.items.length;
  const diversityScore = Math.round((genreCount / totalArtists) * 100);

  // Analyze popularity patterns
  const avgPopularity = topTracks.items.reduce((sum, track) => sum + track.popularity, 0) / topTracks.items.length;
  const mainstreamScore = Math.round(avgPopularity);

  // Determine personality type
  if (diversityScore > 70 && mainstreamScore < 50) {
    personality.type = 'Music Explorer';
    personality.traits = ['Curious', 'Adventurous', 'Open-minded'];
    personality.description = 'You love discovering new sounds and aren\'t afraid to venture into unknown musical territories.';
  } else if (diversityScore < 40 && mainstreamScore > 70) {
    personality.type = 'Mainstream Lover';
    personality.traits = ['Trendy', 'Social', 'Connected'];
    personality.description = 'You enjoy popular music and staying connected with what\'s trending.';
  } else if (diversityScore > 60 && mainstreamScore > 60) {
    personality.type = 'Balanced Listener';
    personality.traits = ['Versatile', 'Adaptable', 'Well-rounded'];
    personality.description = 'You have a well-balanced taste that spans both popular and niche music.';
  } else {
    personality.type = 'Niche Enthusiast';
    personality.traits = ['Unique', 'Independent', 'Authentic'];
    personality.description = 'You have a distinctive taste and prefer music that stands out from the crowd.';
  }

  personality.score = {
    diversity: diversityScore,
    mainstream: mainstreamScore,
    energy: Math.round(Math.random() * 100), // Placeholder - would need audio features
    mood: Math.round(Math.random() * 100)    // Placeholder - would need audio features
  };

  // Generate recommendations based on personality
  if (personality.type === 'Music Explorer') {
    personality.recommendations = [
      'Try exploring world music genres',
      'Check out underground artists',
      'Listen to music from different decades'
    ];
  } else if (personality.type === 'Mainstream Lover') {
    personality.recommendations = [
      'Follow trending playlists',
      'Check out new releases from popular artists',
      'Explore music from different countries'
    ];
  }

  return personality;
}

// Helper function to analyze audio features
function analyzeAudioFeatures(audioFeatures) {
  const features = {
    average: {},
    distribution: {},
    insights: []
  };

  const validFeatures = audioFeatures.audio_features.filter(f => f !== null);
  
  if (validFeatures.length === 0) {
    return features;
  }

  // Calculate averages
  const avgDanceability = validFeatures.reduce((sum, f) => sum + f.danceability, 0) / validFeatures.length;
  const avgEnergy = validFeatures.reduce((sum, f) => sum + f.energy, 0) / validFeatures.length;
  const avgValence = validFeatures.reduce((sum, f) => sum + f.valence, 0) / validFeatures.length;
  const avgTempo = validFeatures.reduce((sum, f) => sum + f.tempo, 0) / validFeatures.length;

  features.average = {
    danceability: Math.round(avgDanceability * 100),
    energy: Math.round(avgEnergy * 100),
    valence: Math.round(avgValence * 100),
    tempo: Math.round(avgTempo)
  };

  // Generate insights
  if (avgDanceability > 0.7) {
    features.insights.push('You love danceable music!');
  }
  if (avgEnergy > 0.7) {
    features.insights.push('You prefer high-energy tracks');
  }
  if (avgValence > 0.7) {
    features.insights.push('You enjoy positive, uplifting music');
  } else if (avgValence < 0.3) {
    features.insights.push('You appreciate more melancholic, emotional music');
  }

  return features;
}

module.exports = router;
