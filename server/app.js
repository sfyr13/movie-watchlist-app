import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Initialize the Express app and port
const app = express();
const PORT = 3000;

//Initialize dotenv to load environment variables
dotenv.config();

// Set up __dirname using ES Modules (because we're using "type": "module" in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));


// Set up the API route to search for movies
app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  
  // Ensure that the query parameter exists
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter." });
  }

  try {
    // Fetch data from OMDb API using your API key (stored in .env file)
    const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // If OMDb API returns an error, send that to the frontend
    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error });
    }
    
    // Otherwise, return the list of movies to the frontend
    res.json({ movies: data.Search });
    
  } catch (error) {
    console.error("Error fetching from OMDb:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
