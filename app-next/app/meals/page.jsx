"use client";
import { Suspense } from "react";
import MealsList from "../../components/MealsList/MealsList";

export default function MealsPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading meals...</div>}>
      <MealsList />
      </Suspense>
    </main>
  );
}