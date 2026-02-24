import express from "express";
import { initDb } from "./src/models/models";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

start();
