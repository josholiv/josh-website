const REQUEST_TIMEOUT_MS = 8000;

const periods = ["recent", "ytd", "all"];

const validate = (key, allowed, value) => {
  if (!allowed.includes(value)) {
    throw new Error(
      `STRAVA_${key.toUpperCase()} not supported. Must be one of: ${allowed.join(", ")}`
    );
  }
  return value;
};

export default class Strava {
  constructor(runtimeEnv = {}) {
    this.env = {
      STRAVA_CLIENT_ID: runtimeEnv.STRAVA_CLIENT_ID ?? import.meta.env.STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET: runtimeEnv.STRAVA_CLIENT_SECRET ?? import.meta.env.STRAVA_CLIENT_SECRET,
      STRAVA_REFRESH_TOKEN: runtimeEnv.STRAVA_REFRESH_TOKEN ?? import.meta.env.STRAVA_REFRESH_TOKEN,
      STRAVA_TIMEFRAME: runtimeEnv.STRAVA_TIMEFRAME ?? import.meta.env.STRAVA_TIMEFRAME,
    };

    if (!this.env.STRAVA_CLIENT_ID || !this.env.STRAVA_CLIENT_SECRET || !this.env.STRAVA_REFRESH_TOKEN) {
      throw new Error("Strava API credentials are missing.");
    }

    this.period = validate("period", periods, this.env.STRAVA_TIMEFRAME || "ytd");
  }

  async #refreshToken() {
    const response = await this.#fetchWithTimeout("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.env.STRAVA_CLIENT_ID,
        client_secret: this.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: this.env.STRAVA_REFRESH_TOKEN,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh Strava token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  async #fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error(`Strava request timed out after ${REQUEST_TIMEOUT_MS}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async #getAthleteStats() {
    const token = await this.#refreshToken();
    const athleteRes = await this.#fetchWithTimeout("https://www.strava.com/api/v3/athlete", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!athleteRes.ok) {
      throw new Error(`Failed to fetch Strava athlete: ${athleteRes.status}`);
    }

    const athleteData = await athleteRes.json();
    const { id, profile } = athleteData;

    const statsRes = await this.#fetchWithTimeout(`https://www.strava.com/api/v3/athletes/${id}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!statsRes.ok) {
      throw new Error(`Failed to fetch Strava stats: ${statsRes.status}`);
    }

    const data = await statsRes.json();

    return {
      id,
      image: profile,
      stats: {
        swim: data[`${this.period}_swim_totals`]?.distance || 0,
        ride: data[`${this.period}_ride_totals`]?.distance || 0,
        run:  data[`${this.period}_run_totals`]?.distance  || 0,
      },
    };
  }

  async fetch() {
    const data = await this.#getAthleteStats();

    return {
      image: data.image,
      url: `https://www.strava.com/athletes/${data.id}`,
      swimDistanceKm: Math.round(data.stats.swim / 1000),
      rideDistanceKm: Math.round(data.stats.ride / 1000),
      runDistanceKm:  Math.round(data.stats.run  / 1000),
    };
  }
}