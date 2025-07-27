"use client";

import React, { useEffect, useState } from "react";
import styles from "./MealsList.module.css";
import Meal from "../Meal/Meal";
import api from "../../utils/api";
import { useSearchParams } from "next/navigation";
import SortControls from "../SortControls/SortControls";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(api("/meals"), window.location.origin);

        if (searchQuery) {
          url.searchParams.append("title", searchQuery);
        }
        if (sortKey) {
          url.searchParams.append("sortKey", sortKey);
          url.searchParams.append("sortDir", sortDir);
        }

        const response = await fetch(url, {
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
        console.error("Error fetching meals:", error);
      }
      setIsLoading(false);
    };

    fetchMeals();
  }, [searchQuery, sortKey, sortDir]);

  if (isLoading) {
    return <p className={styles.loading}>Loading meals...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (meals.length === 0) {
    return (
      <p className={styles.empty}>
        No meals found{searchQuery ? ` for "${searchQuery}"` : ""}.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "All Available Meals"}
      </h2>

      {/* 👇 Sort Controls */}
      <SortControls
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />

      <div className={styles.mealsList}>
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealsList;
