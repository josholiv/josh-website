import axios from "axios"
import cheerio from "cheerio"
import { find, get } from "lodash-es"

const env = import.meta.env

const periods = ["recent", "ytd", "all"]
const periodStrings = {
  recent: "last month",
  ytd: "year to date",
}

const formatDistance = {
  km: (distance) => `${Math.round((distance / 1000) * 10) / 10}k`,
  miles: (distance) => `${Math.round((distance / 1609.344) * 10) / 10}mi`,
}

const methods = ["ride", "run", "swim"]

const methodsString = {
  ride: "cycled",
  run: "ran",
  swim: "swam",
}

const getCopyString = (method, period) =>
  `Distance ${methodsString[method]}${period === "all" ? "" : ` ${periodStrings[period]}`}`

const validate = (key, allowed, value) => {
  if (!allowed.includes(value)) {
    throw new Error(
      `STRAVA_${key.toUpperCase()} not supported, it should be one of the following ${allowed.join(", ")}`,
    )
  }
  return value
}

export default class Strava {
  async #refreshToken() {
    const { data } = await axios.post(
      "https://www.strava.com/api/v3/oauth/token",
      {
        client_id: env.STRAVA_CLIENT_ID,
        client_secret: env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: env.STRAVA_REFRESH_TOKEN,
      },
    )
    return data.access_token
  }

  async #getAthleteStats() {
    const token = await this.#refreshToken()
    const { data: { id, profile } } = await axios.get(
      `https://www.strava.com/api/v3/athlete`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const { data } = await axios.get(
      `https://www.strava.com/api/v3/athletes/${id}/stats`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return {
      id,
      image: profile,
      stats: {
        ride: data[`${this.period}_ride_totals`]?.distance || 0,
        run: data[`${this.period}_run_totals`]?.distance || 0,
        swim: data[`${this.period}_swim_totals`]?.distance || 0,
      },
    }
  }

  constructor() {
    if (!env.STRAVA_CLIENT_ID || !env.STRAVA_CLIENT_SECRET || !env.STRAVA_REFRESH_TOKEN) {
      throw new Error("Strava API credentials are missing.")
    }

    this.period = validate("period", periods, env.STRAVA_TIMEFRAME || "ytd")
    this.unit = validate("unit", ["km", "miles"], env.STRAVA_UNIT || "km")
  }

  async fetch() {
    const data = await this.#getAthleteStats()

    // Format distances for each activity
    const formattedStats = Object.entries(data.stats)
      .map(([method, distance]) => `${methodsString[method]} ${formatDistance[this.unit](distance)}`)
      .join(", ")

    return {
      image: data.image,
      url: `https://www.strava.com/athletes/${data.id}`,
      title: formattedStats, 
      copy: `Distance ${formattedStats} ${this.period === "all" ? "" : periodStrings[this.period]}`,
    }
  }
}
