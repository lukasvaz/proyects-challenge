import express from "express";
import { initDb } from "./src/models/models";
import router from "./src/routes/routes";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/api", router);
async function start() {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  }

start();
