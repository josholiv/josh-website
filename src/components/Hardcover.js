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
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    const endOfYear = `${currentYear}-12-31`;

    const query = `
      query MyReadBooks {
        user_book_reads(
          where: {
            user_book: {
              user_id: { _eq: 29246 }
            }
            finished_at: { _gte: "${startOfYear}", _lte: "${endOfYear}" }
          }
        ) {
          finished_at
        }

        goals(
          where: { user_id: { _eq: 29246 } }
          order_by: { progress: desc }
          limit: 1
        ) {
          goal
          progress
        }

        user_books(
          where: {
            user_id: { _eq: 29246 }
            status_id: { _eq: 3 }
          }
        ) {
          rating
          book {
            title
            cached_tags
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

    return response.data?.data || {};
  }

  async fetch() {
    const data = await this.#fetchData();

    const goalsData = Array.isArray(data.goals) && data.goals.length > 0
      ? [{ goal: data.goals[0].goal, progress: data.user_book_reads?.length ?? data.goals[0].progress }]
      : [];

    const allBooks = data.user_books || [];

    const genreCounts = {};
    for (const entry of allBooks) {
      const genres = entry.book?.cached_tags?.Genre || [];
      if (genres.length > 0) {
        const mainGenre = genres[0].tag;
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
      userBooks: allBooks,
    };
  }
} 