import axios from "axios";

const env = import.meta.env; // Vite-style env, works at build time

const currentYear = new Date().getFullYear();

export default class Hardcover {
  constructor() {
    if (!env.HARDCOVER_API_KEY) {
      throw new Error("Hardcover API credentials are missing.");
    }
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
          "Authorization": `Bearer ${env.HARDCOVER_API_KEY}`,
        },
      }
    );

    // Safely access goals
    return response.data?.data?.me?.goals || [];
  }

  async fetch() {
    const goalsData = await this.#fetchData();

    if (!Array.isArray(goalsData)) {
      console.warn("Hardcover returned invalid goals data:", goalsData);
      return [];
    }

    // Filter goals for the current year
    const yearlyGoals = goalsData.filter(g => g.goal.includes(currentYear));

    // Map to simple objects
    return yearlyGoals.map(g => ({
      goal: g.goal,
      progress: g.progress,
    }));
  }
}
