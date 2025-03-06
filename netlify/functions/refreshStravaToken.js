// .netlify/functions/refreshStravaToken.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
  const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
  const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

  const oauthUrl = 'https://www.strava.com/oauth/token?';

  const oauthFields = {
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    refresh_token: STRAVA_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  };

  const parameters = new URLSearchParams(oauthFields).toString();

  try {
    const response = await fetch(oauthUrl + parameters, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error refreshing token: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: data.access_token }),
    };
  } catch (error) {
    console.error('Error in refreshStravaToken function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
