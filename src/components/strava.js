import axios from "axios";

const env = import.meta.env;
const isDev = import.meta.env.DEV;

const periods = ["recent", "ytd", "all"];
const periodStrings = {
  recent: "last month",
  ytd: "year to date",
};

const formatDistance = {
  km: (distance) => `${Math.round(distance / 1000)} km`, // Rounded to nearest km
  miles: (distance) => `${Math.round(distance / 1609.344)} mi`, // Rounded to nearest mile
};

const methodsString = {
  ride: "🚴",
  run: "🏃‍♂️",
  swim: "🏊",
};

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
    this.unit = validate("unit", ["km", "miles"], env.STRAVA_UNIT || "km");
  }

  // --- Private helpers ---
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
        run: data[`${this.period}_run_totals`]?.distance || 0,
      },
    };
  }

  async #getActivitiesLastYear() {
    const token = await this.#refreshToken();
    const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);

    let page = 1;
    let allActivities = [];

    while (true) {
      const { data } = await axios.get("https://www.strava.com/api/v3/athlete/activities", {
        headers: { Authorization: `Bearer ${token}` },
        params: { after: oneYearAgo, per_page: 200, page },
      });

      if (!data || data.length === 0) break;

      allActivities = allActivities.concat(data);
      page++;
    }

    return allActivities;
  }

  #aggregateActivitiesByDay(activities) {
    const dailyCounts = {};
    activities.forEach((activity) => {
      const day = activity.start_date_local.slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    return dailyCounts;
  }

  #generateDummyDailyCounts() {
    const counts = {};
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = Math.floor(Math.random() * 4) + 1;
    }
    return counts;
  }

  // --- Public methods ---
  async fetch() {
    const data = await this.#getAthleteStats();

    const swimDistanceKm = Math.round(data.stats.swim / 1000);
    const rideDistanceKm = Math.round(data.stats.ride / 1000);
    const runDistanceKm = Math.round(data.stats.run / 1000);

    const swimDistance = formatDistance[this.unit](data.stats.swim);
    const rideDistance = formatDistance[this.unit](data.stats.ride);
    const runDistance = formatDistance[this.unit](data.stats.run);

    return {
      image: data.image,
      url: `https://www.strava.com/athletes/${data.id}`,
      swimDistance,
      rideDistance,
      runDistance,
      swimDistanceKm,
      rideDistanceKm,
      runDistanceKm,
      copy: `${swimDistance} ${rideDistance} ${runDistance} ${
        this.period === "all" ? "" : `(${periodStrings[this.period]})`
      }`,
    };
  }

  async fetchDailyActivityCounts() {
    if (isDev) {
      return { dailyCounts: this.#generateDummyDailyCounts() };
    }

    const activities = await this.#getActivitiesLastYear();
    const dailyCounts = this.#aggregateActivitiesByDay(activities);
    return { dailyCounts };
  }

  // --- STATIC helper for dummy data outside class ---
  static generateDummyDailyCounts() {
    const counts = {};
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = Math.floor(Math.random() * 4) + 1;
    }
    return counts;
  }
}