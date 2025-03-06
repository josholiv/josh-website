async function fetchStravaStats() {
  // Get the new access token from Netlify function
  const tokenResponse = await fetch("/.netlify/functions/refreshStravaToken");
  const { access_token } = await tokenResponse.json();

  // Use the token to get Strava athlete data
  const stravaResponse = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const athleteData = await stravaResponse.json();
  console.log(athleteData); // Check the response in the console

  // Display the data on your site (modify as needed)
  document.getElementById("strava-stats").innerHTML = `
    <h2>${athleteData.firstname} ${athleteData.lastname}</h2>
    <p>Total Rides: ${athleteData.stats.all_ride_totals.count}</p>
    <p>Total Distance: ${athleteData.stats.all_ride_totals.distance} meters</p>
  `;
}
