// refreshStravaToken.cjs

exports.handler = async (event, context) => {
  try {
    // Dynamically import node-fetch
    const { default: fetch } = await import('node-fetch');

    const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
    const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
    const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

    const oathUrl = 'https://www.strava.com/oauth/token?';

    const oauthFields = new URLSearchParams({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });

    const response = await fetch(oathUrl + oauthFields.toString(), {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to refresh token', details: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }),
    };
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
