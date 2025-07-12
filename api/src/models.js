import db from "./db.js";

// Function that helps to get meals
export const getMeals = async (condition = "") => {
  const result = await db.raw(`SELECT * FROM meal ${condition}`);
  return result[0];
};
