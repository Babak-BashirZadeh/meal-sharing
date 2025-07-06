"use client";

import React, { useEffect, useState } from "react";

import styles from "./MealsList.module.css";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        setMeals(data);
      } catch (error) {
        setError(
          "Error loading meals: server unavailable. Please try again later."
        );
      }
      setIsLoading(false);
    };
    fetchMeals();
  }, []);

  if (isLoading) {
    return <p className={styles.loading}>Loading meals...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error loading meals: {error}</p>;
  }

  if (meals.length === 0) {
    return <p className={styles.empty}>No meals available</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Meals</h2>
      {meals.map((meal) => (
        <div key={meal.id} className={styles.mealCard}>
          <h3 className={styles.mealTitle}>{meal.title}</h3>
          <p className={styles.mealDescription}>{meal.description}</p>
          <p className={styles.mealPrice}>
            Price: ${meal?.price ? Number(meal.price).toFixed(2) : "N/A"}
          </p>{" "}
        </div>
      ))}
    </div>
  );
};

export default MealsList;