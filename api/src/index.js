import express from "express";
import { getMeals } from "./models.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewsRouter);

const PORT = process.env.PORT || 3001;

const error404 = "There are no meals for your request.";

// Function that checks whether the meals array is empty
const mealError = (meals, res) => {
  if (meals.length === 0) {
    res.status(404).json({ error: error404 });
  } else {
    res.json(meals);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to Meal Sharing");
});

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

app.get("/past-meals", async (req, res) => {
  try {
    const meals = await getMeals("WHERE when_time < NOW()");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching past meals:", error);
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

app.get("/last-meal", async (req, res) => {
  try {
    const meals = await getMeals("WHERE id = (SELECT MAX(id) FROM meal)");
    mealError(meals, res);
  } catch (error) {
    console.error("Error fetching last meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
