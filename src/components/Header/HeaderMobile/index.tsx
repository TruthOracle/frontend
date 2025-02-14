import { Box } from "@mui/material";
import { NextPage } from "next";
import "./styles.scss";
import HeaderLink from "../HeaderLink";

interface Props {}

const HeaderMobile: NextPage<Props> = ({}) => {
  return (
    <div className="HeaderMobile">
      <HeaderLink
        link="/"
        whiteIcon="/assets/icons/homeicon-white.svg"
        coloredIcon="/assets/icons/homeicon.svg"
        linkCTA="Home"
      />
      <HeaderLink
        link="/my-bets"
        whiteIcon="/assets/icons/bets-white.svg"
        coloredIcon="/assets/icons/bets.svg"
        linkCTA="My Bets"
      />
    </div>
  );
};

export default HeaderMobile;
