"use client";
import { NextPage } from "next";

import {
  useAccount,
  useConnect,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";

import { Box } from "@mui/material";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { USDC_LOGO } from "@/components/helpers/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import { cairo, num } from "starknet";
import {
  CONTRACT_ADDRESS,
  USDC_ADDRESS,
} from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import tokenABI from "../../../abi/ERC20ABI.json";
import { getProbabilites, getString } from "@/components/helpers/functions";
import { enqueueSnackbar } from "notistack";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  outcomes: Outcome[];
  betToken: string;
  moneyInPool: number;
  betPlaced: boolean;
}

const BetActions: NextPage<Props> = ({
  outcomes,
  betToken,
  moneyInPool,
  betPlaced,
}) => {
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { connectors, connect } = useConnect();
  const { choice, setChoice } = useContext(MarketContext);
  const [betAmount, setBetAmount] = useState("");
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [balance, setBalance] = useState("");
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);

  useEffect(() => {
    if (!outcomes) return;
    const percentages = getProbabilites(
      outcomes[0].boughtShares.toString(),
      outcomes[1].boughtShares.toString()
    );
    setPercent1(percentages[0]);
    setPercent2(percentages[1]);
  }, [outcomes]);

  useEffect(() => {
    if (moneyInPool && betAmount != "") {
      getPotentialWinnings(betAmount);
    }
  }, [choice]);

  function getPotentialWinnings(value: string) {
    if (value == "") {
      setBetAmount("");
      setPotentialWinnings(0);
    } else {
      setBetAmount(value);
      if (choice == 0) {
        setPotentialWinnings(
          (parseFloat(value) *
            (parseFloat(value) +
              parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
            (parseFloat(value) +
              parseFloat(outcomes[0].boughtShares.toString()) / 1e6)
        );
      } else {
        setPotentialWinnings(
          (parseFloat(value) *
            (parseFloat(value) +
              parseFloat(BigInt(moneyInPool).toString()) / 1e6)) /
            (parseFloat(value) +
              parseFloat(outcomes[1].boughtShares.toString()) / 1e6)
        );
      }
    }
  }
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const { contract: tokenContract } = useContract({
    address: betToken ? num.getHexString(betToken) : USDC_ADDRESS,
    abi: tokenABI,
  });

  const calls = useMemo(() => {
    if (!address || !contract || betAmount == "" || !tokenContract) return [];

    console.log({
      betAmount, 
      contract, 
      tokenContract,
      address,
    });

    return [
      tokenContract.populateTransaction["approve"]!(
        CONTRACT_ADDRESS,
        cairo.uint256(BigInt(parseFloat(betAmount) * 1e6))
      ),
      contract.populateTransaction["buy_shares"]!(
        parseInt(pathname.split("/")[2]),
        choice,
        cairo.uint256(BigInt(parseFloat(betAmount) * 1e6)),
      ),
    ];
  }, [contract, address, choice, betAmount, tokenContract]);


  const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls,
    });

  useEffect(() => {
    if (!tokenContract || !address) return;
    tokenContract.balance_of(address).then((res: any) => {
      setBalance(res.toString());
    });
  }, [tokenContract, address, betAmount, betToken]);

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds."
      );
    }
    if (data || success) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        data!.transaction_hash
      );
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
    if (isError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again."
      );
    }
  }, [data, isError, isPending, isSuccess, success]);

  useEffect(() => {
    if (!tokenContract || !address || betAmount == "") return;
    tokenContract.allowance(address, CONTRACT_ADDRESS).then((res: any) => {
      setAllowance(res >= BigInt(parseFloat(betAmount) * 1e6));
    });
  }, [tokenContract, address, betAmount, betToken]);

  const handleToast = (message: string, subHeading: string, hash?: string) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: "danger",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  return (
    <Box className='BetActions'>
      <span className='BetActions-Label'>Your Prediction</span>
      <Box className='BetOptionsContainer'>
        <span className='BetOptionsLabel'>Choose your option</span>
        <Box
          onClick={() => {
            setChoice(0);
          }}
          className={choice === 0 ? "BetOptionActive" : "BetOption"}
        >
          <span className='Green'>
            {outcomes ? getString(outcomes[0].name) : "Yes"}
          </span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent1.toFixed(2)}%</span>
            <Box className='RadioButton'>
              <Box className='RadioButtonInner'></Box>
            </Box>
          </Box>
        </Box>
        <Box
          onClick={() => {
            setChoice(1);
          }}
          className={choice === 1 ? "BetOptionActive" : "BetOption"}
        >
          <span className='Red'>
            {outcomes ? getString(outcomes[1].name) : "No"}
          </span>
          <Box className='RadioButtonContainer'>
            <span className='RadioLabel'>{percent2.toFixed(2)}%</span>
            <Box className='RadioButton'>
              <Box className='RadioButtonInner'></Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className='InputContainer'>
        <span className='Label'>Order Value</span>
        <Box className='InputWrapper'>
          <Box className='Input-Left'>
            <Box className='Starknet-logo'>
              <CustomLogo
                src={USDC_LOGO}
              />
            </Box>
            <input
              className='InputField'
              type='number'
              id='numberInput'
              name='numberInput'
              value={betAmount}
              onChange={(e) => getPotentialWinnings(e.target.value)}
              placeholder='0.00'
              required
            />
          </Box>
          <span className='InputField'>
            Balance: {(parseFloat(balance) / 1e6).toString().slice(0, 7)}{" "}
          </span>
        </Box>
      </Box>
      <Box className='ReturnStats'>
        <span className='ReturnLabel'>Potential Winning</span>
        <Box className='ReturnValue'>
          <span className={betAmount == "" ? "Gray" : "Green"}>
            {potentialWinnings ? potentialWinnings.toFixed(5) : 0}
          </span>
          <Box className='Starknet-logo'>
            <CustomLogo
              src={USDC_LOGO}
            />
          </Box>
        </Box>
      </Box>
      {address ? (
        <Box
          onClick={() => writeAsync()}
          className={`ActionBtn ${betPlaced ? "BetPlaced" : ""}`}
        >
          {betPlaced
            ? "Awaiting an Outcome!"
            : betAmount == ""
            ? "Enter Amount"
            : "Place Order"}
        </Box>
      ) : (
        <Box
          onClick={() => connect({ connector: connectors[0] })}
          className='ActionBtn'
        >
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default BetActions;
