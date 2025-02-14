"use client";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Header from "@/components/Header";
import { MarketProvider } from "./context/MarketProvider";
import { SnackbarProvider } from "notistack";
import CustomToastWrapper from "@/components/Toast/Wrapper";
import HeaderMobile from "@/components/Header/HeaderMobile";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <title>TruthOracle - DeFi Prediction Markets Powered by Starknet</title>
        <meta
          name='TruthOracle'
          content='On-chain prediction market on the Starknet ecosystem.'
        />
      </head>
      <body>
        <StarknetProvider>
          <Header />
          <HeaderMobile />
          <MarketProvider>
            <SnackbarProvider
              maxSnack={2}
              Components={{
                //@ts-ignore
                custom: CustomToastWrapper,
              }}
            >
              <main style={{ flex: "1", width: "100%", overflowY: "scroll" }}>
                {children}
              </main>
            </SnackbarProvider>
          </MarketProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
