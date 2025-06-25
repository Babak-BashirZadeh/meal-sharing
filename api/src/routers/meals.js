import express from "express";
import { StatusCodes } from "http-status-codes";
import db from "../db.js";

const router = express.Router();

// /api/meals - GET	Returns all meals
router.get("/", async (req, res) => {
  try {
    let query = db("meal").select("meal.*");

    // maxPrice	- Returns all meals that are cheaper than maxPrice
    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (isNaN(maxPrice)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid maxPrice",
        });
      }
      query = query.where("price", "<=", maxPrice);
    }

    // availableReservations - Returns all meals that still have available spots left, if true. If false, return meals that have no available spots left
    if (req.query.availableReservations !== undefined) {
      const available = req.query.availableReservations === "true";

      // Join reservations, sum guests grouped by meal.id
      query = query
        .leftJoin("reservation", "meal.id", "reservation.meal_id")
        .groupBy("meal.id")
        .select(
          "meal.*",
          db.raw(
            "COALESCE(SUM(reservation.number_of_guests), 0) AS reserved_guests"
          )
        );

      if (available) {
        query = query.havingRaw(
          "meal.max_reservations > COALESCE(SUM(reservation.number_of_guests), 0)"
        );
      } else {
        query = query.havingRaw(
          "meal.max_reservations <= COALESCE(SUM(reservation.number_of_guests), 0)"
        );
      }
    }

    // title - Returns all meals that partially match the given title.
    if (req.query.title) {
      const title = req.query.title.trim();
      query = query.where("title", "like", `%${req.query.title}%`);
    }

    // dateAfter - 	Returns all meals where the date for when is after the given date
    if (req.query.dateAfter) {
      const dateAfter = new Date(req.query.dateAfter);
      if (isNaN(dateAfter.getTime())) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid dateAfter, must be a valid date (YYYY-MM-DD)",
        });
      }
      query = query.where("when_time", ">", dateAfter);
    }

    // dateBefore	- Returns all meals where the date for when is before the given date
    if (req.query.dateBefore) {
      const dateBefore = new Date(req.query.dateBefore);
      if (isNaN(dateBefore.getTime())) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid dateBefore, must be a valid date (YYYY-MM-DD)",
        });
      }
      query = query.where("when_time", "<", dateBefore);
    }

    // limit - Returns the given number of meals
    if (req.query.limit) {
      const limit = Number(req.query.limit);
      if (isNaN(limit) || limit <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid limit, must be a positive number",
        });
      }
      query = query.limit(limit);
    }

    // sortKey	-	Returns all meals sorted by the given key. Allows when, max_reservations and price as keys. Default sorting order is asc(ending).
    // sortDir	String	Returns all meals sorted in the given direction. Only works combined with the sortKey and allows asc or desc.
    if (req.query.sortKey) {
      const validSortKeys = ["when_time", "max_reservations", "price"];
      const sortKey = req.query.sortKey;

      if (!validSortKeys.includes(sortKey)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Invalid sortKey, must be one of ${validSortKeys.join(", ")}`,
        });
      }

      const sortDir = req.query.sortDir === "desc" ? "desc" : "asc";
      query = query.orderBy(sortKey, sortDir);
    }

    const meals = await query;
    res.status(StatusCodes.OK).json(meals);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch meals",
    });
  }
});

// /api/meals - POST Adds a new meal to the database
router.post("/", async (req, res) => {
  try {
    await db.insert(req.body).into("meal");
    res.status(StatusCodes.CREATED).json({});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to add meal",
    });
  }
});

// /api/meals/:id- GET Returns the meal by id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
    }

    const meal = await db("meal").where({ id });

    if (meal.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Meal not found",
      });
    }

    res.status(StatusCodes.OK).json(meal[0]);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch meal",
    });
  }
});

// /api/meals/:id	PUT	Updates the meal by id
router.put("/:id", async (req, res) => {
  try {
    const updatedCount = await db("meal")
      .where({ id: req.params.id })
      .update(req.body);

    if (!updatedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Meal not found",
      });
    }
    res.status(StatusCodes.OK).json({ message: "Meal updated successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to update meal",
    });
  }
});

// /api/meals/:id- DELETE Deletes the meal by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await db("meal").where({ id: req.params.id }).del();

    if (!deletedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Meal not found",
      });
    }
    res.status(StatusCodes.OK).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete meal error:", error.stack || error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to delete meal",
    });
  }
});

export default router;
