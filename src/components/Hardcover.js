import axios from "axios";

const env = import.meta.env; // Vite-style env

export default class Hardcover {
  constructor() {
    if (!env.HARDCOVER_API_KEY) {
      throw new Error("Hardcover API credentials are missing.");
    }
    this.apiKey = env.HARDCOVER_API_KEY;
  }

  async #fetchData() {
    const query = `
      query MyReadBooks {
        me {
          goals {
            goal
            progress
          }
          user_books(where: {status_id: {_eq: 3}}) { # 3 = read
            reviewed_at
            book {
              cached_tags
            }
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

    return response.data?.data?.me?.[0] || { goals: [], user_books: [] };
  }

  async fetch() {
    const data = await this.#fetchData();
    const goalsData = Array.isArray(data.goals)
      ? data.goals.map(g => ({ goal: g.goal, progress: g.progress }))
      : [];

    // Filter books reviewed in 2025
    const books2025 = (data.user_books || []).filter(entry => {
      if (!entry.reviewed_at) return false;
      const year = new Date(entry.reviewed_at).getFullYear();
      return year === 2025;
    });

    // Compute top 5 genres (one genre per book)
    const genreCounts = {};
    for (const entry of books2025) {
      const genres = entry.book?.cached_tags?.Genre || [];
      if (genres.length > 0) {
        const mainGenre = genres[0].tag; // first genre only
        genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
      }
    }

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    return {
      goals: goalsData,
      topGenres,
      userBooks,
    };
  }
}
