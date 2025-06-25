import express from "express";
import { StatusCodes } from "http-status-codes/build/cjs/index.js";
import db from "../db.js";

const router = express.Router();

// /api/reviews - GET	Returns all reviews
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

// /api/meals/:meal_id/reviews	GET	Returns all reviews for a specific meal
router.get("/meal/:meal_id/reviews", async (req, res) => {
  try {
    const mealId = Number(req.params.meal_id);
    if (isNaN(mealId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid meal ID" });
    }

    const reviews = await db("review").where({ meal_id: mealId });

    if (reviews.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No reviews found for this meal",
      });
    }

    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch reviews for the meal",
    });
  }
});

// /api/reviews/:id- GET Returns the review by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
    }

    const review = await db("review").where({ id });

    if (review.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Review not found",
      });
    }

    res.status(StatusCodes.OK).json(review[0]);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch review",
    });
  }
});

// /api/reviews/:id	PUT	Updates the review by id
router.put("/:id", async (req, res) => {
  try {
    const updatedCount = await db("review")
      .where({ id: req.params.id })
      .update(req.body);

    if (!updatedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "review not found",
      });
    }
    res.status(StatusCodes.OK).json({ message: "review updated successfully" });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to update review",
    });
  }
});

// /api/reviews/:id- DELETE Deletes the review by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await db("review").where({ id: req.params.id }).del();

    if (!deletedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Review not found",
      });
    }
    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error.stack || error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to delete review",
    });
  }
});

export default router;
