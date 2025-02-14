"use client";
import { NextPage } from "next";
import "./styles.scss";
import { usePathname } from "next/navigation";

import CustomLogo from "@/components/common/CustomIcons";
import Link from "next/link";

interface Props {
  link: string;
  coloredIcon: string;
  whiteIcon: string;
  linkCTA: string;
}

const HeaderLink: NextPage<Props> = ({
  link,
  coloredIcon,
  whiteIcon,
  linkCTA,
}) => {
  const pathname = usePathname();
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <div className={pathname === link ? "HeaderLink" : "HeaderLink-White"}>
        <div className="HeaderLink-Logo">
          <CustomLogo src={pathname === link ? coloredIcon : whiteIcon} />
        </div>
        {linkCTA}
      </div>
    </Link>
  );
};

export default HeaderLink;
