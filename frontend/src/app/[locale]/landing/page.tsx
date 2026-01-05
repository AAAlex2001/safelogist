import React from "react";
import { Hero } from "./hero";
import styles from "./landing.module.scss";
import Footer from "@/components/footer/Footer";

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
        <Footer />
    </main>
  );
}
