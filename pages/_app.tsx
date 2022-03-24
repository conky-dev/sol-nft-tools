import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { ModalProvider } from "../providers/modal-provider";
import React from "react";
import { AlertProvider } from "../providers/alert-provider";
import Image from "next/image";
import SideMenu, { MenuLink } from "../components/side-menu";
import Head from "next/head";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEndpoint } from "../hooks/use-endpoint";
import TopMenu from "../components/top-menu";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);
function MyApp({ Component, pageProps }) {
  const { endpoint } = useEndpoint();
  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ confirmTransactionInitialTimeout: 120000 }}
    >
      <WalletProvider>
        <AlertProvider>
          <ModalProvider>
            <Head>
              <title>🛠️ Pentacle Tools</title>
            </Head>
            <div className="drawer drawer-end">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="h-screen drawer-content lg:ml-64 relative">
                <div className="hidden lg:inline-block p-4 absolute right-6 top-4">
                  <WalletMultiButton className="w-full" />
                </div>
                <div className="lg:hidden">
                  <TopMenu />
                </div>
                <ul className="hidden lg:inline-block lg:fixed left-0 top-0 bottom-0 menu p-4 overflow-y-auto w-64 bg-base-300 text-base-content space-y-2 relative">
                  <li>
                    <a
                      href="https://pentacle.xyz"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:bg-opacity-0 focus:bg-opacity-0"
                    >
                      <Image
                        src="/pentacle.svg"
                        width={221}
                        height={65}
                        alt="Pentacle"
                      />
                    </a>
                  </li>
                  <MenuLink activatesDrawer={false} href="/get-mints">
                    <div>
                      {" "}
                      <i className="fa-solid fa-fingerprint mr-3"></i>
                      Get Mint IDs
                    </div>
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-meta">
                    <div>
                      <div
                        style={{ width: 14 }}
                        className="inline-flex items-center justify-center mr-3"
                      >
                        <i className="fa-solid fa-info"></i>
                      </div>
                      Token Metadata
                    </div>
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-holders">
                    <div>
                      <i className="fa-solid fa-camera mr-3"></i>
                      Holder Snapshot
                    </div>
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-minters">
                    <i className="fa-solid fa-coins mr-3"></i>
                    NFT Minters
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/burn-nfts">
                    <i className="fa-solid fa-fire mr-3"></i>
                    Burn NFTs
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-ar-links">
                    <i className="fa-solid fa-file-arrow-up mr-3"></i>
                    Arweave Upload
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/snedmaster">
                          <i className="fa-solid fa-hand-holding-dollar mr-3"></i>
                          <span>SnedMaster 9000</span>
                  </MenuLink>

                  <li className="absolute bottom-4 left-0 w-full">
                    <div className={`flex gap-6 items-center justify-center`}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/penta-fun/sol-nft-tools/"
                      >
                        <i
                          className="fab fa-github"
                          style={{ fontStyle: "normal", fontSize: 24 }}
                        ></i>
                      </a>
                      <div className="text-center flex items-center justify-center flex-col">
                        <span>
                          Made with <i className="fa-solid fa-heart ml-1"></i>
                        </span>
                        <a
                          href="https://twitter.com/0xAlice_"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          by 0xAlice
                        </a>
                      </div>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://twitter.com/pentaclexyz"
                      >
                        <i
                          className="fab fa-twitter"
                          style={{ fontStyle: "normal", fontSize: 24 }}
                        ></i>
                      </a>
                    </div>
                  </li>
                </ul>

                <main
                  className={`my-20 px-3 lg:col-span-1 col-span-2`}
                  style={{ maxWidth: "100%" }}
                >
                  <div
                    className="mx-auto"
                    style={{ maxWidth: "100%", width: 800 }}
                  >
                    <Component {...pageProps} />
                  </div>
                </main>
              </div>

              <SideMenu />
            </div>
          </ModalProvider>
        </AlertProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
