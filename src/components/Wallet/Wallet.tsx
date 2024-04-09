import "./Wallet.scss";

import { useMemo } from "react";

// import { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from "@solana-mobile/wallet-adapter-mobile";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  //   GlowWalletAdapter,
  PhantomWalletAdapter,
  //   SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import Lysergic from "../Lysergic/Lysergic";
import { ModalProps, ModalState } from "../../types";

type Props = {
  modal: ModalProps;
};

export function Wallet(props: Props) {
  const { modal } = props;

  const renderedModal = () => {
    switch (modal.state) {
      case ModalState.TokenizeYield:
        return <div />;
      case ModalState.RedeemYield:
        return <div />;
      case ModalState.RedeemFromPT:
        return <div />;
      case ModalState.ClaimYield:
        return <div />;
    }
  };

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      //   new SolanaMobileWalletAdapter({
      //     appIdentity: { name: "Solana Wallet Adapter App" },
      //     authorizationResultCache: createDefaultAuthorizationResultCache(),
      //   }),
      new PhantomWalletAdapter(),
      //   new GlowWalletAdapter(),
      //   new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="spine">
            <div className="wallet-bar">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <div
              className={"mask" + (modal.state !== ModalState.None ? " visible" : "")}
              // onClick={() =>
              //   modal.state !== ModalState.None ? setModal({ state: ModalState.None }) : setMobileDropdownOpen(false)
              // }
            >
              {renderedModal()}
            </div>
            <Lysergic />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
