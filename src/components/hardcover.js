export async function fetchBooksRead() {
    const API_URL = "https://api.hardcover.app/v1/stats?year=2025";
    const API_KEY = import.meta.env.HARDOVER_API_KEY;
  
    try {
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        console.error("Failed to fetch Hardcover data");
        return 0;
      }
  
      const data = await response.json();
      return data.total_books || 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  }
  