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
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card h-100">
            <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">${movie.year}</p>
              <button class="btn btn-danger mt-auto remove-btn" data-id="${movie.imdb_id}">Remove</button>

            </div>
          </div>
        `;
        container.appendChild(col);
      });

      // Add event listeners to remove buttons
      document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const imdbID = btn.getAttribute("data-id");

          try {
            await axios.delete(`/api/watchlist/${imdbID}`);
            //search DOM tree to find and delete closest element matching selector
            btn.closest(".col-md-4").remove();
          } catch (err) {
            console.error("Delete error:", err);
          }
        });
      });

    } catch (err) {
      container.innerHTML = "<p>Error loading watchlist.</p>";
      console.error("Failed to fetch watchlist:", err.message);
    }
  });