import { NextPage } from "next";
import "./styles.scss";

import CustomLogo from "@/components/common/CustomIcons";
import Image from "next/image";

interface Props {
  category: string;
  setActiveTab: Function;
  categoryIndex: number;
  categoryLogo: string;
  categoryName: string;
  cardBgColor: string;
  image: string;
}

const BetHeroCard: NextPage<Props> = ({
  setActiveTab,
  categoryIndex,
  category,
  categoryLogo,
  categoryName,
  cardBgColor,
  image,
}) => {
  return (
    <div className='BetHeroCard' style={{ background: cardBgColor }}>
      <div className='Background-Card'></div>
      <div className='BetHeroCard-HeadingWrapper'>
        <div className='BetHeroCard-HeadingContainer'>
          <div className='Category'>{category}</div>
          <div className='Bet-Details'>
            <div className='Bet-Logo'>
              <CustomLogo src={categoryLogo} />
            </div>
            <span className='Bet-Name'>{categoryName}</span>
          </div>
        </div>
        <div className='Bet-Heading'>{categoryName}</div>
      </div>
      <div className='Predict-Btn' onClick={() => setActiveTab(categoryIndex)}>Predict Now</div>
      <div className='Card-Image'>
        <Image src={image} alt={categoryName} width={350} height={200} />
      </div>
    </div>
  );
};

export default BetHeroCard;
