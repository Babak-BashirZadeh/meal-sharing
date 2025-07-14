"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- update this import!
import styles from "./Header.module.css";
import Logo from "../../assets/mealsharing.jpeg";

const Header = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/meals?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <img
            src={Logo.src}
            alt="Meal Sharing Logo"
            className={styles.logoImage}
          />
        </Link>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            placeholder="Search meals..."
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/meals" className={styles.navLink}>
            All Meals
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
