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
      const response = await axios.get(`/api/search`, {
        params: {query}
      });
      const data = response.data;
      const movies = data.movies;

      resultsContainer.innerHTML = ""; // Clear previous results

      if (data.error) {
        resultsContainer.innerHTML = `<p>${data.error}</p>`;
        return;
      }

      movies.forEach((movie) => {
        const col = document.createElement("div");
        col.className = "col-md-3";
        col.innerHTML = `
          <div class="card h-100">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">${movie.Year}</p>
              <button class="btn btn-success btn-sm mt-auto add-btn"
                data-id="${movie.imdbID}"
                data-title="${movie.Title}"
                data-year="${movie.Year}"
                data-poster="${movie.Poster}">
                ➕ Add to Watchlist
              </button>
            </div>
          </div>
        `;
        resultsContainer.appendChild(col);
      });

      // Attach click handlers to all new "Add to Watchlist" buttons
      document.querySelectorAll(".add-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const { id, title, year, poster } = e.target.dataset;

          try {
            const response = await axios.post("/api/watchlist", {
              imdbID: id,
              title,
              year,
              poster,
            });

            alert(response.data.message);
          } catch (err) {
            console.error("Failed to add to watchlist:", err.message);
            alert("Could not add to watchlist.");
          }
        });
      });
    } catch (err) {
      console.error("Search failed:", err.message);
      resultsContainer.innerHTML = "<p>Error fetching movies.</p>";
    }
  });
});