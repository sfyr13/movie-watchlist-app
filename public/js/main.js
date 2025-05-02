document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim(); //trim whistespace when a user enters movie name (e.g. '   batman  ' -> 'batman')
    const resultsContainer = document.getElementById("results");
  
    resultsContainer.innerHTML = ""; // Clear previous
  
    if (!query) return;
  
    // Simulate 3 dummy results
    for (let i = 0; i < 3; i++) {
      resultsContainer.innerHTML += `
        <div class="col-md-4">
          <div class="card bg-secondary text-white h-100">
            <img src="https://via.placeholder.com/300x450" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">Movie Title ${i + 1}</h5>
              <p class="card-text">This is a short movie description. Real API data will replace this soon.</p>
              <a href="movie.html" class="btn btn-outline-light">Details</a>
            </div>
          </div>
        </div>
      `;
    }
  });