export async function fetchBooksRead() {
  const API_URL = "https://api.hardcover.app/v1/graphql";
  const API_KEY = import.meta.env.HARDOVER_API_KEY;

  const query = `
    {
      me {
        user_books_aggregate(
          where: { 
            _and: [
              { status_id: { _eq: 3 } },
              { last_read_date: { _gte: "2025-01-01" } },
              { last_read_date: { _lt: "2026-01-01" } }
            ]
          }
        ) {
          aggregate {
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query }),
      method: 'POST',
    });

    const result = await response.json();
    console.log("API Response:", result);  // Log the entire response

    return result?.data?.me?.user_books_aggregate?.aggregate?.count ?? null; // Explicitly return the count or null if undefined
  } catch (error) {
    console.error("Error fetching books:", error);
    return null; // Return null if the fetch fails
  }
}
