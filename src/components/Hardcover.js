import axios from "axios";

const env = import.meta.env;

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

    const { data } = await axios.post(
      "https://api.hardcover.app/v1/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.HARDCOVER_API_KEY}`,
        },
      }
    );

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data.me.goals;
  }

  async fetch() {
    const goals = await this.#fetchData();

    // Optionally filter for current year
    const currentYear = new Date().getFullYear();
    const yearlyGoals = goals.filter(g => g.goal.includes(currentYear));

    return yearlyGoals.map(g => ({
      goal: g.goal,
      progress: g.progress,
    }));
  }
}
