import { CairoOption } from "starknet";

export interface Market {
  name: string;
  betToken: string;
  category: string;
  deadline: string;
  description: string;
  isActive: boolean;
  isSettled: boolean;
  outcomes: Outcome[];
  winningOutcome: CairoOption<Outcome>;
  moneyInPool: number;
  image: string;
  marketId: number;
}

export interface Outcome {
  name: string;
  boughtShares: string;
}
