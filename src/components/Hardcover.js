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
        books {
          cached_tags
        }
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

    const data = response.data?.data || {};
    return {
      goals: data.me?.[0]?.goals || [],
      books: data.books || [],
    };
  }

  async fetch() {
    const { goals, books } = await this.#fetchData();

    if (!Array.isArray(goals)) {
      console.warn("Hardcover returned invalid goals data:", goals);
      return { goals: [], topGenres: [] };
    }

    // Map goals (kept exactly as before)
    const goalsData = goals.map(g => ({
      goal: g.goal,
      progress: g.progress,
    }));

    // --- New section: compute top 3 genres ---
    const genreCounts = {};
    for (const book of books) {
      const genres = book.cached_tags?.Genre || [];
      for (const genre of genres) {
        genreCounts[genre.tag] = (genreCounts[genre.tag] || 0) + 1;
      }
    }

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre, count]) => ({ genre, count }));

    // Return both goals and top genres
    return {
      goals: goalsData,
      topGenres,
    };
  }
}
