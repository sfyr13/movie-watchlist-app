document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("watchlistContainer");
  
    try {
      const response = await axios.get("/api/watchlist");
      const data = response.data;
  
      if (!data.movies || data.movies.length === 0) {
        container.innerHTML = "<p>No movies in your watchlist yet.</p>";
        return;
      }
  
      data.movies.forEach((movie) => {
        const col = document.createElement("div");
        col.className = "col-md-3";
        col.innerHTML = `
          <div class="card h-100">
            <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">${movie.year}</p>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    } catch (err) {
      container.innerHTML = "<p>Error loading watchlist.</p>";
      console.error("Failed to fetch watchlist:", err.message);
    }
  });