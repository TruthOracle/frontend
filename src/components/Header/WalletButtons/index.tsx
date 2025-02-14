"use client";
import { NextPage } from "next";
import "./styles.scss";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useNetwork,
} from "@starknet-react/core";

import ConnectWallet from "../ConnectWallet";
import CustomLogo from "@/components/common/CustomIcons";
import { ARGENT_LOGO, ETH_LOGO } from "@/components/helpers/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { getNumber } from "@/components/helpers/functions";

interface Props {}

const WalletButtons: NextPage<Props> = ({}) => {
  const { address } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  const [winnings, setWinnings] = useState("0");
  const {
    chain: { id, name },
  } = useNetwork();

  useEffect(() => {
    const connectToStarknet = async () => {
      const connection = await connect({
        connector: connectors[0],
      });
    };
    connectToStarknet();
  }, []);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const goToClaim = () => {
    router.push("/my-bets");
  };

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getUserTotalWinnings = () => {
      if (!address) return;
      if (!contract) return;
      contract.get_user_total_claimable(address).then((res: any) => {
        setWinnings(getNumber(res.toString()));
      });
    };

    getUserTotalWinnings();
  }, [address, contract]);

  return (
    <div className='WalletButtons'>
      {address ? (
        <div className='Buttons'>
          <div className='ClaimButton' onClick={goToClaim}>
            <Image width={20} height={20} alt='StarkNet' src={ETH_LOGO} />
            {winnings ? parseFloat(winnings).toFixed(2) : "0"} Claim
          </div>
          <div onClick={() => disconnect()} className='AddressBtn'>
            <div className='AddressBtn-Logo'>
              <CustomLogo src={ARGENT_LOGO} />
            </div>
            <span>{shortenedAddress}</span>
          </div>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default WalletButtons;
