import axios from "axios";

const env = import.meta.env;

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
  constructor() {
    if (!env.STRAVA_CLIENT_ID || !env.STRAVA_CLIENT_SECRET || !env.STRAVA_REFRESH_TOKEN) {
      throw new Error("Strava API credentials are missing.");
    }

    this.period = validate("period", periods, env.STRAVA_TIMEFRAME || "ytd");
  }

  async #refreshToken() {
    const { data } = await axios.post("https://www.strava.com/api/v3/oauth/token", {
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: env.STRAVA_REFRESH_TOKEN,
    });
    return data.access_token;
  }

  async #getAthleteStats() {
    const token = await this.#refreshToken();
    const { data: { id, profile } } = await axios.get(
      "https://www.strava.com/api/v3/athlete",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { data } = await axios.get(
      `https://www.strava.com/api/v3/athletes/${id}/stats`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

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