import React from "react";
import styles from "./Meal.module.css";
import Link from "next/link";

const Meal = ({ meal }) => {
  const spotsLeft = meal.max_reservations - (meal.reserved_guests || 0);

  return (
    <div className={styles.mealCard}>
      <div className={styles.mealImageContainer}>
        {meal.image_url ? (
          <img
            src={meal.image_url}
            alt={meal.title}
            className={styles.mealImage}
          />
        ) : (
          <div className={styles.mealImagePlaceholder}>
            <span>No Image Available</span>
          </div>
        )}
      </div>

      <div className={styles.mealContent}>
        <h3 className={styles.mealTitle}>{meal.title}</h3>
        <p className={styles.mealDescription}>{meal.description}</p>
        <p className={styles.mealPrice}>
          {meal?.price ? Number(meal.price).toFixed(2) : "N/A"} DKK
        </p>
        <p className={styles.mealAvailability}>
          {spotsLeft > 0 ? `Available spots: ${spotsLeft}` : "Fully booked"}
        </p>
        <Link href={`/meals/${meal.id}`} className={styles.detailsButton}>
          See Details
        </Link>
      </div>
    </div>
  );
};

export default Meal;
