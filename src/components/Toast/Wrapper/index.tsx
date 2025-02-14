import { forwardRef, useCallback } from "react";
import Image from "next/image";
import "./styles.scss";

import { Box } from "@mui/material";

import { SnackbarContent, CustomContentProps, useSnackbar } from "notistack";
import CustomToast from "..";

interface CustomToastWrapperProps extends CustomContentProps {
  type: string;
  subHeading?: string;
  hash?: string;
}

const CustomToastWrapper = forwardRef<HTMLDivElement, CustomToastWrapperProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id]);

    return (
      <SnackbarContent
        ref={ref}
        className={`CustomToastWrapper-Root${props.type}`}
      >
        <CustomToast
          //@ts-ignore
          message={props.message}
          subHeading={props.subHeading}
          hash={props.hash}
        />
        <Box onClick={handleDismiss} className='CustomToastWrapper-CloseBtn'>
          <Image
            src='/assets/icons/cross.svg'
            alt='Truth-Oracle'
            width={0}
            height={0}
            style={{
              width: "14px",
              height: "14px",
              objectFit: "cover",
            }}
          />
        </Box>
      </SnackbarContent>
    );
  }
);

CustomToastWrapper.displayName = "CustomToastWrapper";

export default CustomToastWrapper;
