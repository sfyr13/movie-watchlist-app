import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";
import axios from "axios";
import pkg from "pg";

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
app.use(express.json()); //Needed to parse JSON in POST requests

// Set up PostgreSQL connection
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// Set up the API route to search for movies
app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  
  // Ensure that the query parameter exists
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter." });
  }

  try {
    // Fetch data from OMDb API using your API key (stored in .env file)
    // const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    // const response = await fetch(apiUrl);
    // const data = await response.json();

    const response = await axios.get("http://www.omdbapi.com/", {
      params : {
        apikey: process.env.OMDB_API_KEY,
        s: query,
      }
    });

    const data = response.data;

    // If OMDb API returns an error, send that to the frontend
    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error });
    }
    
    // Otherwise, return the list of movies to the frontend
    res.json({ movies: data.Search });
    

  } catch (error) {
    console.error("Axios error", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ New route to add to watchlist
app.post("/api/watchlist", async (req, res) => {
  const { imdbID, title, year, poster } = req.body;

  if (!imdbID || !title) {
    return res.status(400).json({ error: "Missing movie data" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO watchlist (imdb_id, title, year, poster) VALUES ($1, $2, $3, $4) ON CONFLICT (imdb_id) DO NOTHING RETURNING *",
      [imdbID, title, year, poster]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Already in watchlist" });
    }

    res.status(201).json({ message: "Added to watchlist", movie: result.rows[0] });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
