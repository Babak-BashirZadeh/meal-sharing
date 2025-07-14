"use client";

import React, { useState, useEffect } from "react";
import styles from "./MealDetail.module.css";
import ReservationForm from "../ReservationForm/ReservationForm";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MealDetail = ({ mealId }) => {
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/meals/${mealId}`
        );

        if (!response.ok) {
          throw new Error(`Meal not found (Status: ${response.status})`);
        }

        const data = await response.json();
        setMeal(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching meal:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mealId) {
      fetchMeal();
    }
  }, [mealId]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading meal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <Link href="/meals" className={styles.backLink}>
          ← Back to all meals
        </Link>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className={styles.notFoundContainer}>
        <p>Meal not found</p>
        <Link href="/meals" className={styles.backLink}>
          ← Back to all meals
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Back
      </button>

      <div className={styles.mealHeader}>
        <h1 className={styles.mealTitle}>{meal.title}</h1>
      </div>

      <div className={styles.mealContent}>
        <div className={styles.mealImageContainer}>
          {meal.image_url ? (
            <img
              src={meal.image_url}
              alt={meal.title}
              className={styles.mealImage}
            />
          ) : (
            <div className={styles.mealImagePlaceholder}></div>
          )}
        </div>

        <div className={styles.mealDetails}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.mealDescription}>
            {meal.description}
            <br />
            <br />
            <span className={styles.descriptionPrice}>
              Price:{" "}
              {meal.price != null
                ? `${Number(meal.price).toFixed(2)} DKK`
                : "Not available"}
            </span>
          </p>

          <div className={styles.mealMeta}>
            <p>
              <strong>Location:</strong> {meal.location || "Not specified"}
            </p>
            <p>
              <strong>When:</strong>{" "}
              {meal.when_time
                ? `${new Date(
                    meal.when_time
                  ).toLocaleDateString()} at ${new Date(
                    meal.when_time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Time not set"}
            </p>
            <p>
              <strong>Max reservations:</strong> {meal.max_reservations}
            </p>
            <p className={styles.availableSpots}>
              <strong>Available spots:</strong>{" "}
              {meal.available_spots ??
                meal.max_reservations - (meal.reserved_guests || 0)}
            </p>
          </div>
        </div>
      </div>

      {meal.max_reservations > 0 && (
        <div className={styles.reservationSection}>
          <h2 className={styles.sectionTitle}>Make a Reservation</h2>
          <ReservationForm
            mealId={mealId}
            maxReservations={meal.max_reservations}
          />
        </div>
      )}

      <div className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Reviews</h2>
        <ReviewsSection mealId={mealId} />
      </div>
    </div>
  );
};

export default MealDetail;
