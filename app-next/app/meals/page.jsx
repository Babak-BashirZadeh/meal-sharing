"use client";
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import MealsList from "../../components/MealsList/MealsList";

// Dynamically import MealsList with ssr: false
// This tells Next.js NOT to render this component on the server during build/prerendering.
const DynamicMealsList = dynamic(() => import('./MealsList'), {
  ssr: false, // This is the key!
  loading: () => <p>Loading Meals...</p>, // Optional: A loading component while it loads on client
});


export default function MealsPage() {
  return (
    <main>
      <MealsList />
    </main>
  );
}