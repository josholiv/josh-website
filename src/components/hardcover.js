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
        user_books {
          title
          author {
            name
          }
          last_read_date
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

    const { data } = await response.json();

    if (data && data.me && data.me.user_books) {
      const books = data.me.user_books;
      books.forEach(book => {
        console.log("Book title:", book.title);
        console.log("Author:", book.author.name);
        console.log("Last read date:", book.last_read_date);
      });
    } else {
      console.log("No books found in the specified range.");
    }

  } catch (error) {
    console.error("Error fetching books:", error);
  }
}
