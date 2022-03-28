import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { SOL_ADDRESS_REGEXP } from "../util/validators";
import { ModalContext } from "../providers/modal-provider";
import { useEndpoint } from "../hooks/use-endpoint";
import { AlertContext } from "../providers/alert-provider";
import { getMints } from "../util/get-nft-mints";
import { useWallet } from "@solana/wallet-adapter-react";
import Head from "next/head";

export default function GibMints() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { setModalState } = useContext(ModalContext);
  const { endpoint } = useEndpoint();
  const { setAlertState } = useContext(AlertContext);
  const { connected, publicKey } = useWallet();
  const [counter, setCounter] = useState(0);
  const fetchMints = async (val = "", wlToken: string) => {
    setAlertState({
      message: (
        <button className="btn btn-disabled btn-ghost loading">
          Downloading your data.
        </button>
      ),
      open: true,
    });
    setLoading(true);
    getMints(val, endpoint, setCounter, wlToken)
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setModalState({
          message: e,
          open: true,
        });
        setLoading(false);
      })
      .finally(() => {
        setAlertState({
          message: "",
          open: false,
        });
        setLoading(false);
      });
  };

  const pubkeyString = publicKey?.toBase58();

  return (
    <>
      <Head>
        <title>🛠️ Pentacle Tools - 🆔 NFT Minters</title>
      </Head>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl text-white">Get NFT Mints</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tool gets all mint IDs associated with the given address.
      </p>
      <hr className="opacity-10 my-4" />
      <div className="px-2 text-center">
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Be aware: Solanas latest update killed the way that we used to fetch
          the mints for a certain candy machine. Right now this site is
          implementing experimental crawling. It can be quite slow (&gt;30 minutes) and is not
          100% reliable
        </div>
      </div>
      <hr className="opacity-10 my-4" />
      <div className="card bg-gray-900">
        <form
          onSubmit={handleSubmit(({ address, wlToken }) => fetchMints(address, wlToken))}
          className={`w-full flex flex-col`}
        >
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-4 justify-center label">
                  Please enter SOL/CM address 
                </label>
                <input
                  {...register("address", {
                    required: "This field is required!",
                    pattern: {
                      value: SOL_ADDRESS_REGEXP,
                      message: "Invalid address",
                    },
                  })}
                  required
                  type="text"
                  className={`input shadow-lg w-full ${
                    !!errors?.address?.message && "input-error"
                  }`}
                  id="address-field"
                  autoComplete="on"
                />
                {!!errors?.address?.message && (
                  <label className="label text-error">
                    {errors?.address?.message}
                  </label>
                )}
              </div>
              <div>
                <label className="mb-4 justify-center label">
                 If there was a whitelist token, please enter its mint
                </label>
                <input
                  {...register("wlToken", {
                    pattern: {
                      value: SOL_ADDRESS_REGEXP,
                      message: "Invalid address",
                    },
                  })}
                  type="text"
                  className={`input shadow-lg w-full ${
                    !!errors?.wlToken?.message && "input-error"
                  }`}
                  id="wl-token-field"
                  autoComplete="on"
                />
                {!!errors?.address?.message && (
                  <label className="label text-error">
                    {errors?.wlToken?.message}
                  </label>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className={`btn btn-primary rounded-box shadow-lg ${
                  loading ? "loading" : ""
                }`}
                disabled={errors?.address}
                type="submit"
              >
                {loading ? `Getting Mints.. ${counter} so far ` : "Get Mints!"}
              </button>
              {connected ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("address", pubkeyString);
                    fetchMints(pubkeyString, undefined);
                  }}
                  className="btn btn-primary rounded-box"
                >
                  {" "}
                  Use Wallet <br />
                  {pubkeyString.slice(0, 3)}...
                  {pubkeyString.slice(
                    pubkeyString.length - 3,
                    pubkeyString.length
                  )}
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
