import express from "express";

import db from "../db.js";

const router = express.Router();

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


// /api/reviews	POST	Adds a new review to the database.

router.post("/", async (req, res) => {
  const { meal_id, rating, comment } = req.body;

  if (!meal_id || !rating || !comment) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing required fields: meal_id, rating, and comment",
    });
  }

  try {
    const newReview = {
      meal_id,
      rating,
      comment,
      created_at: new Date(),
    };

    const [id] = await db("review").insert(newReview).returning("id");

    res.status(StatusCodes.CREATED).json({ id, ...newReview });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to add review",
    });
  }
});


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
