"use client";
import "./styles.scss";

import BetSection from "@/components/BetSection";

export default function Home() {
  return (
    <main className='Home'>
      <div className='Heading-Section'>
        <span className='Heading'>Predict and Earn — 10x Fun and Easy!</span>
        <span className='Sub-Heading'>
          Predict markets and make swift decisions with decentralized, crowd-sourced insights.
        </span>
      </div>
      <BetSection />
    </main>
  );
}
