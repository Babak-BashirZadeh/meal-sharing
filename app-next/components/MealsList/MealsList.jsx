"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import MealCard from "./Meal";
import api from "../../utils/api"; // Adjust the import path as necessary
const serverUrl = "http://localhost:3001"; // Replace with your actual server URL if different


import styles from "./MealsList.module.css";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  // Fetch meals from the API when the component mounts
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(serverUrl +"/api/meals"); // Replace with your actual API endpoint if different
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setMeals(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        setError("Failed to load meals. Please try again later.");
      }
    };

    fetchMeals();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "2rem",
            color: "#333",
          }}
        >
          Meals
        </Typography>
        {error && (
          <Typography
            variant="body1"
            color="error"
            sx={{ textAlign: "center", marginBottom: "1rem" }}
          >
            {error}
          </Typography>
        )}
        <Grid container spacing={4} justifyContent="center">
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={meal.id}>
              <MealCard meal={meal} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>

  );
};

export default MealsList;