import express from "express";
import { StatusCodes } from "http-status-codes/build/cjs/index.js";
import db from "../db.js";

const router = express.Router();

// //api/reservations - GET	Returns all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await db.select().from("reservation");
    res.status(StatusCodes.OK).json(reservations);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch reservations",
    });
  }
});

// /api/reservations - POST Adds a new reservation to the database
router.post("/", async (req, res) => {
  try {
    await db.insert(req.body).into("reservation");
    res.status(StatusCodes.CREATED).json({});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to add reservation",
    });
  }
});

// /api/reservations/:id - GET Returns a reservation by id
router.get("/:id", async (req, res) => {
  try {
    const reservation = await db("reservation")
      .where({ id: req.params.id })
      .first();

    if (!reservation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Reservation not found",
      });
    }

    res.status(StatusCodes.OK).json(reservation);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to fetch reservation",
    });
  }
});

// /api/reservations/:id - PUT Updates the reservation by id
router.put("/:id", async (req, res) => {
  try {
    const updatedCount = await db("reservation")
      .where({ id: req.params.id })
      .update(req.body);

    if (!updatedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Reservation not found",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Reservation updated successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to update reservation",
    });
  }
});

// /api/reservations/:id - DELETE Deletes the reservation by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCount = await db("reservation")
      .where({ id: req.params.id })
      .del();

    if (!deletedCount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Reservation not found",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error, failed to delete reservation",
    });
  }
});

export default router;
