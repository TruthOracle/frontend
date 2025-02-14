import { NextPage } from "next";
import { useEffect, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { CRICKET_LOGO, CRYPTO_LOGO, UEFA_LOGO, US_LOGO } from "../helpers/icons";
import BetCard from "./BetCard";
import { useContract } from "@starknet-react/core";
import abi from "../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { Market } from "../helpers/types";
import { getNumber, getString } from "../helpers/functions";
interface Props {}

const tabList = [
  {
    tabName: "Trending",
  },
  {
    tabName: "Crypto Market",
  },
  {
    tabName: "Euro 2025",
  },
  {
    tabName: "World Athletics Championships",
  },
  {
    tabName: "Global Politics",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = () => {
      if (!contract) {
        return;
      }
      contract.get_all_markets().then((res: any) => {
        setMarkets(res.map((market: any) => market));
      });
    };
    getAllMarkets();
  }, []);

  useEffect(() => {
    setActiveTab(0);
  }, []);
  return (
    <div className='BetSection'>
      <div className='BetSection-Hero'>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={1}
            category='Crypto Market'
            categoryLogo={CRYPTO_LOGO}
            categoryName='Bitcoin to $200k'
            cardBgColor='linear-gradient(67.58deg,rgb(255, 176, 59) -0.96%,rgb(170, 119, 0) 78.06%)'
            image='/assets/images/crypto-growth.png'
          />
        </div>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={2}
            category='Sports'
            categoryLogo={UEFA_LOGO}
            categoryName='UEFA Euro 2025'
            cardBgColor='linear-gradient(90deg,rgb(51, 237, 37) 0%,rgb(28, 175, 2) 100%)'
            image='/assets/images/football.png'
          />
        </div>
      </div>
      <div className='BetSection-CardWrapper'>
        <div className='Tabs-Section'>
          {tabList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(index);
              }}
              className={activeTab === index ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className='BetCard-Wrapper'>
          {activeTab === 0
            ? markets
                .sort(
                  (a, b) =>
                    parseFloat(getNumber(b.moneyInPool)) -
                    parseFloat(getNumber(a.moneyInPool))
                )
                .map((item, index) => (
                  <div key={index} className='BetCard-Container'>
                    <BetCard
                      marketId={item.marketId}
                      category={item.category}
                      logo={item.image}
                      duration={item.deadline}
                      heading={item.name}
                      betToken={item.betToken}
                      subHeading={item.description}
                      outcomes={item.outcomes}
                      moneyInPool={item.moneyInPool}
                    />
                  </div>
                ))
            : markets
                .filter((market) =>
                  tabList[activeTab].tabName.includes(
                    getString(market.category)
                  )
                )
                .sort(
                  (a, b) =>
                    parseFloat(getNumber(b.moneyInPool)) -
                    parseFloat(getNumber(a.moneyInPool))
                )
                .map((item, index) => (
                  <div key={index} className='BetCard-Container'>
                    <BetCard
                      marketId={item.marketId}
                      category={item.category}
                      logo={item.image}
                      duration={item.deadline}
                      heading={item.name}
                      betToken={item.betToken}
                      subHeading={item.description}
                      outcomes={item.outcomes}
                      moneyInPool={item.moneyInPool}
                    />
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default BetSection;
