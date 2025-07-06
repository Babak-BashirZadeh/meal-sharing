import express from "express";
import { statusCodes } from "http-status-codes";
import db from "./db.js";

// /api/reservations	GET	Returns all reservations
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const reservations = await db.getReservations();
    res.status(statusCodes.OK).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch reservations" });
  }
});

// /api/reservations	POST	Adds a new reservation to the database
router.post("/", async (req, res) => {
  try {
    await db.insert(req.body).into("reservations");
    res
      .status(statusCodes.CREATED)
      .json({ message: "Reservation added successfully" });
  } catch (error) {
    console.error("Error adding reservation:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add reservation" });
  }
});

///api/reservations/:id	GET	Returns a reservation by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Invalid reservation ID" });
    }
    const reservation = await db("reservations").where({ id }).first();
    if (reservation === undefined) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Reservation not found" });
    }
    res.status(statusCodes.OK).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch reservation" });
  }
});

// /api/reservations/:id	PUT	Updates the reservation by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Invalid reservation ID" });
    }
    const updatedRows = await db("reservations").where({ id }).update(req.body);
    if (updatedRows === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Reservation not found" });
    }
    res
      .status(statusCodes.OK)
      .json({ message: "Reservation updated successfully" });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update reservation" });
  }
});

// /api/reservations/:id	DELETE	Deletes the reservation by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Invalid reservation ID" });
    }
    const deletedRows = await db("reservations").where({ id }).del();
    if (deletedRows === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Reservation not found" });
    }
    res
      .status(statusCodes.OK)
      .json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete reservation" });
  }
});
export default router;
