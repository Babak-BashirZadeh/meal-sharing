import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";

import reviewsRouter from "./routers/reviews.js"

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("./routers/meals", mealsRouter);
app.use("./routers/reservations", reservationsRouter);

app.use("./routers/reviews", reviewsRouter);

const apiRouter = express.Router();


app.get("/all-meals", async (req, res) => {
  try {
    const meals = await getMeals("ORDER BY id");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching all meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/future-meals", async (req, res) => {
  try {
    const meals = await getMeals("WHERE when_time > NOW()");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching future meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/first-meal", async (req, res) => {
  try {
    const meals = await getMeals("WHERE id = (SELECT MIN(id) FROM meal)");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching first meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  const meals = await getMeals("WHERE id = (SELECT MIN(id) FROM meal)");
  mealError(meals, res);
});

app.get("/past-meals", async (req, res) => {
  try {
    const meals = await getMeals("WHERE when_time < NOW()");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching past meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/last-meal", async (req, res) => {
  try {
    const meals = await getMeals("WHERE id = (SELECT MAX(id) FROM meal)");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching last meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
