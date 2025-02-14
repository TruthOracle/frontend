import { NextPage } from "next";
import Image from "next/image";

interface Props {
  src: string;
  width?: string;
  height?: string;
}

const CustomLogo: NextPage<Props> = ({ src, width, height }) => {
  return (
    <>
      <Image
        style={{
          width: width ? width : "100%",
          height: height ? height : "100%",
          objectFit: "cover",
        }}
        width={0}
        height={0}
        src={src}
        alt='truthoracle'
      />
    </>
  );
};

export default CustomLogo;
