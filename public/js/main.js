document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("results");

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (!query) {
      resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      resultsContainer.innerHTML = ""; // Clear previous results

      if (data.error) {
        resultsContainer.innerHTML = `<p>${data.error}</p>`;
        return;
      }

      data.movies.forEach(movie => {
        const card = `
          <div class="col-md-3">
            <div class="card h-100">
              <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" class="card-img-top" alt="${movie.Title}">
              <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
              </div>
            </div>
          </div>
        `;
        resultsContainer.innerHTML += card;
      });

    } catch (error) {
      console.error("Fetch error:", error);
      resultsContainer.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }
  });
});