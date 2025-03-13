import { writeFile } from "fs/promises";

export async function handler(event) {
  const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN;

  if (event.httpMethod === "GET") {
    // Strava webhook subscription verification
    const params = new URLSearchParams(event.queryStringParameters);
    if (params.get("hub.verify_token") === STRAVA_VERIFY_TOKEN) {
      return {
        statusCode: 200,
        body: JSON.stringify({ "hub.challenge": params.get("hub.challenge") }),
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      
      if (body.object_type === "activity" && body.aspect_type === "create") {
        console.log("New activity detected:", body);
        
        // Fetch updated stats from Strava API
        const stats = await fetchStravaStats();

        // Save to file (Netlify doesn't have persistent storage, so you might use Redis, FaunaDB, or S3)
        await writeFile("/tmp/strava-stats.json", JSON.stringify(stats));

        return { statusCode: 200, body: "Activity processed" };
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      return { statusCode: 500, body: "Internal Server Error" };
    }
  }

  return { statusCode: 400, body: "Invalid request" };
}

// Fetch latest Strava stats
async function fetchStravaStats() {
  const token = await refreshToken();
  const { data } = await axios.get(
    "https://www.strava.com/api/v3/athlete/stats",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    ride: data.ytd_ride_totals.distance,
    run: data.ytd_run_totals.distance,
    swim: data.ytd_swim_totals.distance,
  };
}

// Refresh Strava API Token
async function refreshToken() {
  const { data } = await axios.post("https://www.strava.com/api/v3/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
  });

  return data.access_token;
}
