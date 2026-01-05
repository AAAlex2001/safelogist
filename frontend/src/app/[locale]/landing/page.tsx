import React from "react";
import { Hero } from "./hero";
import styles from "./landing.module.scss";

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
    </main>
  );
}
