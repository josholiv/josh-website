import axios from "axios"
import cheerio from "cheerio"
import { get } from "lodash-es"

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
    
    const {
      data: { id, username, firstname, profile },
    } = await axios.get(`https://www.strava.com/api/v3/athlete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { data } = await axios.get(
      `https://www.strava.com/api/v3/athletes/${id}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // Fetch distances for all methods
    const distances = {}
    for (const method of methods) {
      const key = `${this.period}_${method}_totals`
      if (data[key]) {
        distances[method] = {
          distance: data[key].distance,
          duration: data[key].moving_time,
        }
      }
    }

    return {
      id,
      username,
      firstname,
      image: profile,
      distances,
    }
  }

  constructor() {
    if (!env.STRAVA_CLIENT_ID || !env.STRAVA_CLIENT_SECRET || !env.STRAVA_REFRESH_TOKEN) {
      throw new Error(
        "Strava API client ID, secret, and refresh token are needed for this widget",
      )
    }

    this.period = validate("timeframe", periods, env.STRAVA_TIMEFRAME || "ytd")
    this.unit = validate("unit", ["km", "miles"], env.STRAVA_UNIT || "km")
  }

  async fetch() {
    const data = await this.#getAthleteStats()

    return {
      image: data.image,
      url: `https://www.strava.com/athletes/${data.id}`,
      stats: methods.map((method) => ({
        method,
        title: formatDistance[this.unit](data.distances[method]?.distance || 0),
        copy: getCopyString(method, this.period),
      })),
    }
  }
}
