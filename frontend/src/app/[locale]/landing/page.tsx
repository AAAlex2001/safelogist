import React from "react";
import { Hero } from "./hero";
import styles from "./landing.module.scss";
import Footer from "@/components/footer/Footer";
import { Functions } from "./functions/Functions";
import { Steps } from "./steps/Steps";
import Reviews from "./reviews/Reviews";

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
      <Functions />
      <Steps />
      <Reviews />
      <Footer />
    </main>
  );
}
