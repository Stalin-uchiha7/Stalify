const express = require('express');
const spotifyAPI = require('../utils/spotifyAPI');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Generate JWT token
const generateJWT = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      displayName: user.display_name 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/callback - Handle OAuth callback
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for tokens
    const tokenData = await spotifyAPI.exchangeCodeForToken(code);
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user profile
    const userProfile = await spotifyAPI.getUserProfile(access_token);

    // Generate JWT token
    const jwtToken = generateJWT(userProfile);

    // Return user data and tokens
    res.json({
      success: true,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      jwtToken: jwtToken,
      user: {
        id: userProfile.id,
        display_name: userProfile.display_name,
        email: userProfile.email,
        country: userProfile.country,
        followers: userProfile.followers?.total || 0,
        images: userProfile.images || [],
        product: userProfile.product,
        external_urls: userProfile.external_urls
      }
    });

  } catch (error) {
    console.error('Auth callback error:', error);
    
    // Handle specific Spotify API errors
    let errorMessage = 'Authentication failed';
    let userFriendlyMessage = 'Something went wrong during authentication. Please try again.';
    
    if (error.message.includes('user may not be registered')) {
      errorMessage = 'User not registered in Spotify app';
      userFriendlyMessage = 'Your Spotify account is not registered for this app. Please contact the developer or try again later.';
    } else if (error.message.includes('invalid_grant')) {
      errorMessage = 'Invalid authorization code';
      userFriendlyMessage = 'The authorization code has expired or is invalid. Please try logging in again.';
    } else if (error.message.includes('INVALID_CLIENT')) {
      errorMessage = 'Invalid Spotify app configuration';
      userFriendlyMessage = 'There\'s an issue with the Spotify app configuration. Please try again later.';
    } else if (error.message.includes('access_denied')) {
      errorMessage = 'User denied access';
      userFriendlyMessage = 'You denied access to your Spotify account. Please try again and grant the necessary permissions.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      message: userFriendlyMessage,
      details: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenData = await spotifyAPI.refreshAccessToken(refreshToken);
    
    res.json({
      success: true,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      refreshToken: tokenData.refresh_token || refreshToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Token refresh failed',
      message: error.message 
    });
  }
});

// GET /api/auth/profile - Get user profile (requires JWT)
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const accessToken = authHeader.split(' ')[1];
    const userProfile = await spotifyAPI.getUserProfile(accessToken);

    res.json({
      success: true,
      user: {
        id: userProfile.id,
        display_name: userProfile.display_name,
        email: userProfile.email,
        country: userProfile.country,
        followers: userProfile.followers?.total || 0,
        images: userProfile.images || [],
        product: userProfile.product,
        external_urls: userProfile.external_urls
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message 
    });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

module.exports = router;
