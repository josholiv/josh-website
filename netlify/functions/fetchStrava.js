// netlify/functions/fetchStrava.js
import fetch from 'node-fetch';

export const handler = async function () {
    try {
        const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
        const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
        const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

        // Get a new access token using the refresh token
        const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch latest activities from Strava
        const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const activities = await activitiesResponse.json();

        console.log('Fetched Strava Activities:', activities);

        // Store or process the data as needed (e.g., write to a database or file storage)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Strava data fetched successfully!', data: activities }),
        };
    } catch (error) {
        console.error('Error fetching Strava data:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
