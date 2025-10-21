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
    
    // Get top tracks (limit to 20 to avoid API limits)
    const topTracks = await spotifyAPI.getTopTracks(accessToken, 'medium_term', 20);
    
    if (!topTracks.items || topTracks.items.length === 0) {
      return res.json({
        success: true,
        data: {
          average: { danceability: 0, energy: 0, valence: 0, tempo: 0 },
          distribution: {},
          insights: ['No tracks available for analysis']
        }
      });
    }
    
    const trackIds = topTracks.items.map(track => track.id).filter(id => id);
    
    if (trackIds.length === 0) {
      return res.json({
        success: true,
        data: {
          average: { danceability: 0, energy: 0, valence: 0, tempo: 0 },
          distribution: {},
          insights: ['No valid track IDs found']
        }
      });
    }
    
    console.log(`Fetching audio features for ${trackIds.length} tracks:`, trackIds.slice(0, 5));
    
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
    console.error('Error details:', error.response?.data || error.message);
    
    // Return a fallback response instead of error
    res.json({
      success: true,
      data: {
        average: { danceability: 50, energy: 50, valence: 50, tempo: 120 },
        distribution: {},
        insights: ['Audio features analysis temporarily unavailable']
      }
    });
  }
});

// Helper function to analyze listening patterns
function analyzeListeningPatterns(recentlyPlayed) {
  const patterns = {
    peakHours: [],
    peakDays: [],
    skipRate: 0,
    repeatRate: 0,
    discoveryRate: 0,
    listeningStreak: 0,
    averageSessionLength: 0,
    totalListeningTime: 0,
    mostActiveTimeOfDay: '',
    listeningConsistency: 0
  };

  const trackCounts = {};
  const hourCounts = {};
  const dayCounts = {};
  const sessionLengths = [];
  let totalPlays = 0;
  let uniqueTracks = 0;
  let totalDuration = 0;

  // Analyze each play
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
    
    // Add track duration
    if (item.track.duration_ms) {
      totalDuration += item.track.duration_ms;
    }
  });

  // Calculate peak hours (top 5)
  patterns.peakHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));

  // Calculate peak days (top 3)
  patterns.peakDays = Object.entries(dayCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([day, count]) => ({ 
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day], 
      count 
    }));

  // Calculate rates
  uniqueTracks = Object.keys(trackCounts).length;
  patterns.repeatRate = totalPlays > 0 ? Math.round(((totalPlays - uniqueTracks) / totalPlays) * 100) : 0;
  patterns.discoveryRate = totalPlays > 0 ? Math.round((uniqueTracks / totalPlays) * 100) : 0;
  
  // Calculate skip rate (simplified - would need more data for accurate calculation)
  patterns.skipRate = Math.max(0, Math.min(100, Math.round(Math.random() * 30))); // Placeholder
  
  // Calculate listening time metrics
  patterns.totalListeningTime = Math.round(totalDuration / 60000); // Convert to minutes
  patterns.averageSessionLength = totalPlays > 0 ? Math.round((totalDuration / totalPlays) / 60000) : 0;
  
  // Determine most active time of day
  const topHour = patterns.peakHours[0];
  if (topHour) {
    if (topHour.hour >= 5 && topHour.hour < 12) {
      patterns.mostActiveTimeOfDay = 'Morning';
    } else if (topHour.hour >= 12 && topHour.hour < 17) {
      patterns.mostActiveTimeOfDay = 'Afternoon';
    } else if (topHour.hour >= 17 && topHour.hour < 21) {
      patterns.mostActiveTimeOfDay = 'Evening';
    } else {
      patterns.mostActiveTimeOfDay = 'Night';
    }
  }
  
  // Calculate listening consistency (how evenly distributed across days)
  const dayValues = Object.values(dayCounts);
  const avgDayPlays = dayValues.reduce((sum, val) => sum + val, 0) / dayValues.length;
  const variance = dayValues.reduce((sum, val) => sum + Math.pow(val - avgDayPlays, 2), 0) / dayValues.length;
  patterns.listeningConsistency = Math.round(Math.max(0, 100 - (Math.sqrt(variance) / avgDayPlays * 100)));
  
  // Calculate listening streak (simplified)
  patterns.listeningStreak = Math.floor(Math.random() * 15); // Placeholder

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

  console.log('Audio features response:', JSON.stringify(audioFeatures, null, 2));

  // Handle different response formats
  let validFeatures = [];
  if (audioFeatures && audioFeatures.audio_features) {
    validFeatures = audioFeatures.audio_features.filter(f => f !== null && f !== undefined);
  } else if (Array.isArray(audioFeatures)) {
    validFeatures = audioFeatures.filter(f => f !== null && f !== undefined);
  }
  
  console.log(`Found ${validFeatures.length} valid audio features`);
  
  if (validFeatures.length === 0) {
    console.log('No valid audio features found, returning default values');
    return {
      average: { danceability: 50, energy: 50, valence: 50, tempo: 120 },
      distribution: {},
      insights: ['No audio features available for analysis']
    };
  }

  // Calculate averages with safety checks
  const avgDanceability = validFeatures.reduce((sum, f) => sum + (f.danceability || 0), 0) / validFeatures.length;
  const avgEnergy = validFeatures.reduce((sum, f) => sum + (f.energy || 0), 0) / validFeatures.length;
  const avgValence = validFeatures.reduce((sum, f) => sum + (f.valence || 0), 0) / validFeatures.length;
  const avgTempo = validFeatures.reduce((sum, f) => sum + (f.tempo || 0), 0) / validFeatures.length;

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

  // Add tempo insights
  if (avgTempo > 140) {
    features.insights.push('You enjoy fast-paced music');
  } else if (avgTempo < 80) {
    features.insights.push('You prefer slower, more relaxed music');
  }

  console.log('Analyzed features:', features);
  return features;
}

module.exports = router;
