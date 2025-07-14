"use client";

import React from "react";
import styles from "./SortControls.module.css";

const SortControls = ({ sortKey, setSortKey, sortDir, setSortDir }) => {
  return (
    <div className={styles.sortControls}>
      <label>
        Sort by:
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="">-- None --</option>
          <option value="when_time">Date</option>
          <option value="price">Price</option>
          <option value="max_reservations">Max Reservations</option>
        </select>
      </label>

      <label>
        Direction:
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
};

export default SortControls;
