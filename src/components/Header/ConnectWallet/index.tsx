"use client";
import { NextPage } from "next";
import "./styles.scss";

import { useConnect } from "@starknet-react/core";

interface Props {}

const ConnectWallet: NextPage<Props> = ({}) => {
  const { connectors, connect } = useConnect();
  return (
    <div
      className="ConnectBtn"
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect Wallet
    </div>
  );
};

export default ConnectWallet;
