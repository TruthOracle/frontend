"use client";
import BetActions from "@/components/BetDetailView/BetActions";
import BetDetails from "@/components/BetDetailView/BetDetails";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useContract } from "@starknet-react/core";
import abi from "../../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import { Market } from "@/components/helpers/types";
import { NextPage } from "next";
import { enqueueSnackbar } from "notistack";
import CustomLogo from "@/components/common/CustomIcons";
import { BACK_LOGO } from "@/components/helpers/icons";

const BetDetailView: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [market, setMarket] = useState<Market | null>(null);
  const [userPlacedBet, setUserPlacedBet] = useState(false);
  const handleBack = () => {
    router.push("/");
  };
  const pathname = usePathname();

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getMarket = () => {
      if (!contract) {
        return;
      }
      contract.get_market(pathname.split("/")[2]).then((res: any) => {
        setMarket(res);
      });
      if (!address) return;
      contract.get_user_markets(address).then((res: any) => {
        for (const market of res) {
          if (market.marketId == pathname.split("/")[2]) {
            setUserPlacedBet(true);
          }
        }
      });
    };
    getMarket();
  }, [contract, address, pathname]);

  useEffect(() => {
    if (userPlacedBet) {
      enqueueSnackbar("Bet already placed!", {
        //@ts-ignore
        variant: "custom",
        subHeading:
          "You have already placed a bet on this market. Please wait for the outcome, we hope you win as well!",
        type: "danger",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  }, [userPlacedBet]);

  return (
    <div className='BetDetailView'>
      <div className='GoBack' onClick={handleBack}>
        <CustomLogo width={"30px"} height={"20px"} src={BACK_LOGO} />
        <div>Back</div>
      </div>
      <BetDetails
        category={market?.category || ""}
        duration={market?.deadline || ""}
        heading={market?.name || ""}
        logo={market?.image || ""}
        subHeading={market?.description || ""}
        moneyInPool={market?.moneyInPool || 0}
        betToken={market?.betToken || ""}
      />

      <BetActions
        betPlaced={userPlacedBet}
        moneyInPool={market?.moneyInPool!}
        betToken={market?.betToken!}
        outcomes={market?.outcomes!}
        marketCategory={market?.category!}
      />
    </div>
  );
};

export default BetDetailView;
