import axios from "axios";

const env = import.meta.env;

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
            rating
            book {
              title
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

    const allBooks = data.user_books || [];

    // Compute top 5 genres (one genre per book)
    const genreCounts = {};
    for (const entry of allBooks) {
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
      userBooks: allBooks, // all read books
    };
  }
}
