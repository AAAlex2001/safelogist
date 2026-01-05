import React from "react";
import { Hero } from "./hero";
import styles from "./landing.module.scss";
import Footer from "@/components/footer/Footer";
import { Functions } from "./functions/Functions";

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
      <Functions/>
      <Footer />
    </main>
  );
}
