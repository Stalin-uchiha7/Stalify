const axios = require('axios');

class SpotifyAPI {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this.authURL = 'https://accounts.spotify.com/api/token';
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(this.authURL, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(this.authURL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  // Make authenticated request to Spotify API
  async makeRequest(endpoint, accessToken, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params,
      });

      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error.response?.data || error.message);
      throw new Error(`Failed to fetch data from Spotify API: ${endpoint}`);
    }
  }

  // Get user profile
  async getUserProfile(accessToken) {
    return this.makeRequest('/me', accessToken);
  }

  // Get user's top tracks
  async getTopTracks(accessToken, timeRange = 'medium_term', limit = 20) {
    return this.makeRequest('/me/top/tracks', accessToken, {
      time_range: timeRange,
      limit: limit,
    });
  }

  // Get user's top artists
  async getTopArtists(accessToken, timeRange = 'medium_term', limit = 20) {
    return this.makeRequest('/me/top/artists', accessToken, {
      time_range: timeRange,
      limit: limit,
    });
  }

  // Get user's recently played tracks
  async getRecentlyPlayed(accessToken, limit = 20) {
    return this.makeRequest('/me/player/recently-played', accessToken, {
      limit: limit,
    });
  }

  // Get user's playlists
  async getUserPlaylists(accessToken, limit = 20) {
    return this.makeRequest('/me/playlists', accessToken, {
      limit: limit,
    });
  }

  // Get audio features for tracks
  async getAudioFeatures(accessToken, trackIds) {
    const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
    return this.makeRequest('/audio-features', accessToken, {
      ids: ids,
    });
  }

  // Get track details
  async getTrack(accessToken, trackId) {
    return this.makeRequest(`/tracks/${trackId}`, accessToken);
  }

  // Get artist details
  async getArtist(accessToken, artistId) {
    return this.makeRequest(`/artists/${artistId}`, accessToken);
  }

  // Get multiple artists
  async getArtists(accessToken, artistIds) {
    const ids = Array.isArray(artistIds) ? artistIds.join(',') : artistIds;
    return this.makeRequest('/artists', accessToken, {
      ids: ids,
    });
  }
}

module.exports = new SpotifyAPI();
