import { NextPage } from "next";
import "./styles.scss";
import { Box, Skeleton } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import {
  CLOCK_ICON,
  USDC_LOGO,
} from "@/components/helpers/icons";
import { useEffect, useState } from "react";
import { getNumber, getTimeBetween } from "@/components/helpers/functions";

interface Props {
  category: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
  moneyInPool: number;
  betToken: string;
}

const BetDetails: NextPage<Props> = ({
  category,
  logo,
  duration,
  heading,
  subHeading,
  moneyInPool,
  betToken,
}) => {
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration)).getTime();
    const timeBetween = getTimeBetween(deadline, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [duration]);

  return (
    <Box className='BetModal-DetailsContainer'>
      <Box className='HeadingContainer'>
        <Box className='BetName'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={logo} width={"30px"} height={"30px"} />
          </Box>
          <span>
            {category ? (
              category
            ) : (
              <Skeleton variant="rectangular" width={100} height={20} />
            )}
          </span>
        </Box>
        <Box className='BetDuration'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={CLOCK_ICON} />
          </Box>
          <span>
            {daysRemaining}d: {hoursRemaining}h : {minutes}m
          </span>
        </Box>
      </Box>
      <Box className="BetDetails">
        <span className="Heading">
          {heading ? (
            heading
          ) : (
            <Skeleton variant="rectangular" width={100} height={20} />
          )}
        </span>
        <span className="Sub-Heading">
          {subHeading ? (
            subHeading
          ) : (
            <Skeleton variant="rectangular" width={100} height={20} />
          )}
        </span>
      </Box>
      <Box className='BetPool'>
        Prize-Pool{" "}
        <span className='Colored'>{getNumber(moneyInPool).slice(0, 7)}</span>{" "}
        <Box className='Starknet-logo'>
          <CustomLogo
            src={USDC_LOGO}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BetDetails;
