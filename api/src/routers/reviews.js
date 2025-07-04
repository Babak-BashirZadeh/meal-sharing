import express from "express";
import db from "../db.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

// /api/reviews	GET	Returns all reviews.

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

// /api/meals/:meal_id/reviews	GET	Returns all reviews for a specific meal.

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

// /api/reviews/:id	GET	Returns a review by id.

router.get("/:id", async (req, res) => {
  const reviewId = Number(req.params.id);

  if (isNaN(reviewId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
  }

  try {
    const review = await db("review").where({ id: reviewId }).first();

    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch review",
    });
  }
});

// /api/reviews/:id	PUT	Updates the review by id.

router.put("/:id", async (req, res) => {
  const reviewId = Number(req.params.id);
  const { rating, comment } = req.body;

  if (isNaN(reviewId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
  }

  if (!rating && !comment) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "At least one field (rating or comment) must be provided for update",
    });
  }

  try {
    const updatedReview = {};
    if (rating) updatedReview.rating = rating;
    if (comment) updatedReview.comment = comment;

    const result = await db("review")
      .where({ id: reviewId })
      .update(updatedReview);

    if (result === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    res.status(StatusCodes.OK).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to update review",
    });
  }
});

///api/reviews/:id	DELETE	Deletes the review by id.

router.delete("/:id", async (req, res) => {
  const reviewId = Number(req.params.id);

  if (isNaN(reviewId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
  }

  try {
    const result = await db("review").where({ id: reviewId }).del();

    if (result === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to delete review",
    });
  }
});

export default router;
