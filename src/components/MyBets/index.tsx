"use client";
import React, { useEffect, useState } from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";
import { Market } from "../helpers/types";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";

function MyBets() {
  const { address } = useAccount();

  const [openMarkets, setOpenMarkets] = useState<Market[]>([]);
  const [openBets, setOpenBets] = useState<any>([]);
  const [closedMarkets, setClosedMarkets] = useState<Market[]>([]);
  const [closedBets, setClosedBets] = useState<any>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = async () => {
      if (!contract || !address) {
        return;
      }
      if (openMarkets.length > 0 || closedMarkets.length > 0) return;
      const res = await contract.get_user_markets(address);
      const openMarketsRes: Market[] = [];
      const closedMarketsRes: Market[] = [];
      const openBets: any[] = [];
      const closedBets: any[] = [];
      for (const market of res) {
        if (market.isActive) {
          openMarketsRes.push(market);
        } else {
          closedMarketsRes.push(market);
        }
        const outcomeAndBet = await contract.get_outcome_and_bet(address, market.marketId, 0);
        if (market.isActive) {
          openBets.push(outcomeAndBet);
        } else {
          closedBets.push(outcomeAndBet);
        }
      }
      setOpenMarkets(openMarketsRes);
      setClosedMarkets(closedMarketsRes);
      setOpenBets(openBets);
      setClosedBets(closedBets);
    };
    getAllMarkets();
  }, [address, contract]);

  return (
    <div className='MyBets'>
      <OpenPositions openMarkets={openMarkets} openBets={openBets} />
      <ClosedPositions closedMarkets={closedMarkets} closedBets={closedBets} />
    </div>
  );
}

export default MyBets;
