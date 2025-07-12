import express from "express";
import { StatusCodes } from "http-status-codes/build/cjs/index.js";
import db from "../db.js";

const router = express.Router();

// GET /api/reviews - Returns all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await db.select().from("review");
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch reviews",
    });
  }
});

// GET /api/reviews/:mealId - Returns all reviews for a specific meal
router.get("/:mealId", async (req, res) => {
  try {
    const mealId = Number(req.params.mealId);
    if (isNaN(mealId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid meal ID" });
    }
    const reviews = await db("review").where({ meal_id: mealId });
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

// POST /api/reviews - Add a new review
router.post("/", async (req, res) => {
  try {
    const { title, description, meal_id, stars } = req.body;

    const mealIdInt = Number(meal_id);
    const starsInt = Number(stars);

    if (!mealIdInt || !starsInt || starsInt < 1 || starsInt > 5) {
      return res.status(400).json({
        error: "meal_id and stars must be valid numbers. stars must be 1-5.",
      });
    }

    const meal = await db("meal").where({ id: mealIdInt }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    console.log("Inserting review:", {
      title,
      description,
      meal_id: mealIdInt,
      stars: starsInt,
    });

    const insertedIds = await db("review").insert({
      title,
      description,
      meal_id: mealIdInt,
      stars: starsInt,
    });

    console.log("Inserted IDs:", insertedIds);

    res.status(201).json({
      id: insertedIds[0], // inserted row id
      title,
      description,
      meal_id: mealIdInt,
      stars: starsInt,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /api/reviews/:id - Update a review by id
router.put("/:id", async (req, res) => {
  try {
    const updatedCount = await db("review")
      .where({ id: req.params.id })
      .update(req.body);

    if (!updatedCount) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to update review",
    });
  }
});

// DELETE /api/reviews/:id - Delete a review by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await db("review").where({ id: req.params.id }).del();

    if (!deletedCount) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to delete review",
    });
  }
});

export default router;
