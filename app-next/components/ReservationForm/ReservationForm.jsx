"use client";

import React, { useState } from "react";
import styles from "./ReservationForm.module.css";

const ReservationForm = ({ mealId, maxReservations }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          meal_id: mealId,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage({
        text: "Reservation successful!",
        isError: false,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        numberOfGuests: 1,
      });
    } catch (error) {
      setMessage({
        text: error.message || "Reservation failed",
        isError: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength="2"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="numberOfGuests">
          Number of Guests (max {maxReservations})
        </label>
        <input
          type="number"
          id="numberOfGuests"
          name="numberOfGuests"
          min="1"
          max={maxReservations}
          value={formData.numberOfGuests}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Processing..." : "Book Now"}
      </button>

      {message.text && (
        <p
          className={`${styles.message} ${
            message.isError ? styles.error : styles.success
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default ReservationForm;
