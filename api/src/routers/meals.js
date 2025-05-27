import express from "express";
import { statusCodes } from "http-status-codes";
import db from "./db.js";

const router = express.Router();

// /api/meals	GET	Returns all meals
router.get("/", async (req, res) => {
  try {
    const meals = await db.getMeals();
    res.status(statusCodes.OK).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch meals" });
  }
});

// /api/meals	POST	Adds a new meal to the database
router.post("/", async (req, res) => {
  try {
    await db.insert(req.body).into("meals");
    res
      .status(statusCodes.CREATED)
      .json({ message: "Meal added successfully" });
  } catch (error) {
    console.error("Error adding meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add meal" });
  }
});

// /api/meals/:id	GET	Returns the meal by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Invalid meal ID" });
    }
    const meal = await db("meals").where({ id }).first();
    if (meal === undefined) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch meal" });
  }
});

// /api/meals/:id	PUT	Updates the meal by id
router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = await db("meals")
      .where({ id: req.params.id })
      .update(req.body);
    if (updatedMeal === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json({ message: "Meal updated successfully" });
  } catch (error) {
    console.error("Error updating meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update meal" });
  }
});

///api/meals/:id	DELETE	Deletes the meal by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeal = await db("meals").where({ id: req.params.id }).del();
    if (deletedMeal === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete meal" });
  }
});

export default router;
