import axios from "axios";

const env = import.meta.env; // Vite-style env, works at build time

export default class Hardcover {
  constructor() {
    if (!env.HARDCOVER_API_KEY) {
      throw new Error("Hardcover API credentials are missing.");
    }
    this.apiKey = env.HARDCOVER_API_KEY;
  }

  async #fetchData() {
    const query = `
      query MyQuery {
        me {
          goals {
            goal
            progress
          }
        }
      }
    `;

    const response = await axios.post(
      "https://api.hardcover.app/v1/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
      }
    );

    // Safely access goals
    return response.data?.data?.me?.[0]?.goals || [];
  }

  async fetch() {
    const goalsData = await this.#fetchData();

    if (!Array.isArray(goalsData)) {
      console.warn("Hardcover returned invalid goals data:", goalsData);
      return [];
    }

    // Map to simple objects (no year filtering)
    return goalsData.map(g => ({
      goal: g.goal,
      progress: g.progress,
    }));
  }
}
