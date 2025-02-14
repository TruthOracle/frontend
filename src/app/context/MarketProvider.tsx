"use client";

import { createContext, useState } from "react";

interface MarketContextType {
  choice: number;
  setChoice: (choice: number) => void;
}

export const MarketContext = createContext<MarketContextType>({
  choice: 0,
  setChoice: () => {},
});

export function MarketProvider({ children }: any) {
  const [choice, setChoice] = useState<number>(0);

  return (
    <MarketContext.Provider value={{ choice, setChoice }}>
      {children}
    </MarketContext.Provider>
  );
}
