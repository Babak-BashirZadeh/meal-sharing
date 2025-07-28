"use client";

import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import Meal from "../Meal/Meal.jsx";
import api from "../../utils/api";
import Link from "next/link";

function HomePage() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(api("/meals"));
        const data = await response.json();
        setMeals(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>
            Share meals, share moments
          </h1>
          <p>Connect through food experiences with your community</p>
        </div>
      </div>

      <section className={styles.featuredMeals}>
        <div className={styles.sectionHeader}>
          <h2>Featured Meals</h2>
          <Link href="/meals" className={styles.seeAll}>
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.mealsGrid}>
            {meals.map((meal) => (
              <Meal key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;