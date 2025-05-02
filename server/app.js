import express from "express";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

// Basic test route to check if API works
app.get("/api/search", (req, res) => {
    res.json({ message: "API route working!" });
  });
