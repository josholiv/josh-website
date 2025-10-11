import axios from "axios";

export default class Hardcover {
  constructor() {
    if (!process.env.HARDCOVER_API_KEY) {
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
          "Authorization": `Bearer ${process.env.HARDCOVER_API_KEY}`,
        },
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    // Safely return goals, fallback to empty array
    return response.data?.data?.me?.goals || [];
  }

  async fetch() {
    const goalsData = await this.#fetchData();

    if (!Array.isArray(goalsData)) {
      console.warn("Hardcover returned invalid goals data:", goalsData);
      return [];
    }

    // Filter for current year
    const currentYear = new Date().getFullYear();
    const yearlyGoals = goalsData.filter(g => g.goal.includes(currentYear));

    return yearlyGoals.map(g => ({
      goal: g.goal,
      progress: g.progress,
    }));
  }
}
