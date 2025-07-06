import express from "express";

import { statusCodes } from "http-status-codes";
import db from "./db.js";

const router = express.Router();

// /api/meals	GET	Returns all meals
router.get("/", async (req, res) => {
  try {
    const meals = await db.getMeals();
    res.status(statusCodes.OK).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch meals" });
  }
});

// /api/meals	POST	Adds a new meal to the database
router.post("/", async (req, res) => {
  try {
    await db.insert(req.body).into("meals");
    res
      .status(statusCodes.CREATED)
      .json({ message: "Meal added successfully" });
  } catch (error) {
    console.error("Error adding meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add meal" });
  }
});

// /api/meals/:id	GET	Returns the meal by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Invalid meal ID" });
    }
    const meal = await db("meals").where({ id }).first();
    if (meal === undefined) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch meal" });
  }
});

// /api/meals/:id	PUT	Updates the meal by id
router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = await db("meals")
      .where({ id: req.params.id })
      .update(req.body);
    if (updatedMeal === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json({ message: "Meal updated successfully" });
  } catch (error) {
    console.error("Error updating meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update meal" });
  }
});

///api/meals/:id	DELETE	Deletes the meal by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeal = await db("meals").where({ id: req.params.id }).del();
    if (deletedMeal === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Meal not found" });
    }
    res.status(statusCodes.OK).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete meal" });

import { StatusCodes } from "http-status-codes";
import db from "../db.js";

const router = express.Router();
//GET api/meals route
//maxPrice	Number	Returns all meals that are cheaper than maxPrice.	api/meals?maxPrice=90
router.get("/", async (req, res) => {
  try {
    let query = db("meal").select("*");
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      if (isNaN(maxPrice)) {
        return res.status(400).json({ error: "Invalid maxPrice parameter" });
      }
      query = query.where("price", "<=", maxPrice);
    }

    // availableReservations	Boolean	Returns all meals that still have available spots left, if true. If false, return meals that have no available spots left.1	api/meals?availableReservations=true

    if (req.query.availableReservations) {
      const available =
        req.query.availableReservations.toLowerCase() === "true";
      if (available) {
        query = query.where(
          "max_reservations",
          ">",
          db.raw("reservations_count")
        );
      } else {
        query = query.where(
          "max_reservations",
          "<=",
          db.raw("reservations_count")
        );
      }
    }

    // title	String	Returns all meals that partially match the given title. Rød grød will match the meal with the title Rød grød med fløde.	api/meals?title=Indian%20platter

    if (req.query.title) {
      const title = req.query.title;
      query = query.where("title", "like", `%${title}%`);
    }

    // dateAfter	Date	Returns all meals where the date for when is after the given date.	api/meals?dateAfter=2022-10-01
    if (req.query.dateAfter) {
      const dateAfter = new Date(req.query.dateAfter);
      if (isNaN(dateAfter.getTime())) {
        return res.status(400).json({ error: "Invalid dateAfter parameter" });
      }
      query = query.where("when", ">", dateAfter);
    }

    // dateBefore	Date	Returns all meals where the date for when is before the given date.	api/meals?dateBefore=2022-08-08
    if (req.query.dateBefore) {
      const dateBefore = new Date(req.query.dateBefore);
      if (isNaN(dateBefore.getTime())) {
        return res.status(400).json({ error: "Invalid dateBefore parameter" });
      }
      query = query.where("when", "<", dateBefore);
    }

    // limit	Number	Returns the given number of meals.	api/meals?limit=7
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ error: "Invalid limit parameter" });
      }
      query = query.limit(limit);
    }

    // sortKey2	String	Returns all meals sorted by the given key. Allows when, max_reservations and price as keys. Default sorting order is asc(ending).	api/meals?sortKey=price
    if (req.query.sortKey) {
      const sortKey = req.query.sortKey;
      if (!["when", "max_reservations", "price"].includes(sortKey)) {
        return res.status(400).json({ error: "Invalid sortKey parameter" });
      }
      query = query.orderBy(sortKey, "asc");
    }

    const meals = await query;
    res.status(Statuscodes.OK).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

export default router;
