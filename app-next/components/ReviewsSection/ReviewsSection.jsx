"use client";

import React, { useState, useEffect } from "react";
import styles from "./ReviewsSection.module.css";

const ReviewsSection = ({ mealId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    title: "",
    description: "",
    stars: 5,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/reviews/${mealId}`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };

    fetchReviews();
  }, [mealId]);

  const handleStarClick = (value) => {
    setNewReview({ ...newReview, stars: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReview,
          meal_id: mealId,
          // **Do NOT send created_at** — backend will handle it
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const addedReview = await response.json();
      setReviews([...reviews, addedReview]);
      setNewReview({
        title: "",
        description: "",
        stars: 5,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return <p className={styles.loadingReviews}>Loading reviews...</p>;
  if (error) return <p className={styles.errorMessage}>Error: {error}</p>;

  return (
    <div>
      {reviews.length > 0 ? (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <h3>{review.title}</h3>
              <div className={styles.stars}>
                {"★".repeat(review.stars)}
                {"☆".repeat(5 - review.stars)}
              </div>
              <p>{review.description}</p>
              <small>
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyReviews}>
          No reviews yet. Be the first to review!
        </p>
      )}

      <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
        <h3>Add Your Review</h3>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className={styles.input}
            value={newReview.title}
            onChange={(e) =>
              setNewReview({ ...newReview, title: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className={styles.input}
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Rating</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`${styles.star} ${
                  num <= newReview.stars ? styles.filled : ""
                }`}
                onClick={() => handleStarClick(num)}
                role="button"
                aria-label={`${num} star${num > 1 ? "s" : ""}`}
              >
                ★{" "}
              </span>
            ))}
          </div>
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewsSection;
