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

// GET /api/stats/top-tracks - Get user's top tracks
router.get('/top-tracks', verifyToken, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 20 } = req.query;
    const accessToken = req.accessToken;

    const topTracks = await spotifyAPI.getTopTracks(accessToken, time_range, parseInt(limit));

    res.json({
      success: true,
      data: topTracks,
      timeRange: time_range,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Top tracks error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top tracks',
      message: error.message 
    });
  }
});

// GET /api/stats/top-artists - Get user's top artists
router.get('/top-artists', verifyToken, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 20 } = req.query;
    const accessToken = req.accessToken;

    const topArtists = await spotifyAPI.getTopArtists(accessToken, time_range, parseInt(limit));

    res.json({
      success: true,
      data: topArtists,
      timeRange: time_range,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Top artists error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top artists',
      message: error.message 
    });
  }
});

// GET /api/stats/recently-played - Get recently played tracks
router.get('/recently-played', verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const accessToken = req.accessToken;

    const recentlyPlayed = await spotifyAPI.getRecentlyPlayed(accessToken, parseInt(limit));

    res.json({
      success: true,
      data: recentlyPlayed,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Recently played error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recently played tracks',
      message: error.message 
    });
  }
});

// GET /api/stats/playlists - Get user's playlists
router.get('/playlists', verifyToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const accessToken = req.accessToken;

    const playlists = await spotifyAPI.getUserPlaylists(accessToken, parseInt(limit));

    res.json({
      success: true,
      data: playlists,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Playlists error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch playlists',
      message: error.message 
    });
  }
});

// GET /api/stats/audio-features - Get audio features for tracks
router.get('/audio-features', verifyToken, async (req, res) => {
  try {
    const { track_ids } = req.query;
    const accessToken = req.accessToken;

    if (!track_ids) {
      return res.status(400).json({ error: 'Track IDs are required' });
    }

    const trackIds = track_ids.split(',');
    const audioFeatures = await spotifyAPI.getAudioFeatures(accessToken, trackIds);

    res.json({
      success: true,
      data: audioFeatures
    });

  } catch (error) {
    console.error('Audio features error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch audio features',
      message: error.message 
    });
  }
});

// GET /api/stats/summary - Get comprehensive user stats summary
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const accessToken = req.accessToken;

    // Fetch all data in parallel
    const [
      topTracksShort,
      topTracksMedium,
      topTracksLong,
      topArtistsShort,
      topArtistsMedium,
      topArtistsLong,
      recentlyPlayed,
      playlists
    ] = await Promise.all([
      spotifyAPI.getTopTracks(accessToken, 'short_term', 10),
      spotifyAPI.getTopTracks(accessToken, 'medium_term', 20),
      spotifyAPI.getTopTracks(accessToken, 'long_term', 50),
      spotifyAPI.getTopArtists(accessToken, 'short_term', 10),
      spotifyAPI.getTopArtists(accessToken, 'medium_term', 20),
      spotifyAPI.getTopArtists(accessToken, 'long_term', 50),
      spotifyAPI.getRecentlyPlayed(accessToken, 20),
      spotifyAPI.getUserPlaylists(accessToken, 20)
    ]);

    // Calculate genre distribution from top artists
    const genreCounts = {};
    [...topArtistsShort.items, ...topArtistsMedium.items, ...topArtistsLong.items]
      .forEach(artist => {
        artist.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));

    res.json({
      success: true,
      data: {
        topTracks: {
          shortTerm: topTracksShort,
          mediumTerm: topTracksMedium,
          longTerm: topTracksLong
        },
        topArtists: {
          shortTerm: topArtistsShort,
          mediumTerm: topArtistsMedium,
          longTerm: topArtistsLong
        },
        recentlyPlayed,
        playlists,
        genreDistribution: topGenres,
        summary: {
          totalTracksAnalyzed: topTracksLong.items.length,
          totalArtistsAnalyzed: topArtistsLong.items.length,
          totalGenres: topGenres.length,
          topGenre: topGenres[0]?.genre || 'Unknown'
        }
      }
    });

  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user summary',
      message: error.message 
    });
  }
});

module.exports = router;
