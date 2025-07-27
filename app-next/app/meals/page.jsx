"use client";
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import MealsList from "../../components/MealsList/MealsList";

export default function MealsPage() {
  return (
    <main>
      <MealsList />
    </main>
  );
}