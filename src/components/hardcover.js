export async function fetchBooksRead() {
    const API_URL = "https://api.hardcover.app/graphql";
    const API_KEY = import.meta.env.HARDOVER_API_KEY;
  
    const query = `
      query {
        user {
          stats(year: 2025) {
            totalBooks
          }
        }
      }
    `;
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
  
      const json = await response.json();
      console.log("Hardcover API Response:", json);
  
      return json.data?.user?.stats?.totalBooks || 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  }
  