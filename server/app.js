import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";


const app = express();
const PORT = 3000;

//Initialize dotenv to load environment variables
dotenv.config();

// Set up __dirname using ES Modules (because we're using "type": "module" in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));


// Route: /api/search?query=batman
app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter." });
  }

  try {
    const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error });
    }

    res.json({ movies: data.Search });
  } catch (error) {
    console.error("Error fetching from OMDb:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
