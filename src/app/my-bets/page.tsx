import React from "react";
import "./bets.scss";
import BetDetails from "@/components/MyBets"; 

function page() {
  return (
    <div className='Contents'>
      <BetDetails />
    </div>
  );
}

export default page;
