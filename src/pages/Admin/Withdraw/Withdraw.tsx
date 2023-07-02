import { useState } from "react";

export const Withdraw = () => {
  const [walletBalance, setWalletBalance] = useState(10000);
  return (
    <>
      <div className="flex flex-row items-center justify-between bg-primary rounded-lg w-10/12 text-[#fff] px-1 md:px-6  py-4 mt-10 mx-auto mb-20 md:text-xl ">
        <p> Your wallet balance </p>
        <p> {`${walletBalance} KSH `} </p>
      </div>

      <form className="flex flex-col items-center justify-center shadow-lg rounded-lg w-10/12 mx-auto py-10 ">
        <label className="text-sm text-[lightGrey] mt-2" htmlFor="amount">
          {" "}
          * 100 KSH per withdrawal{" "}
        </label>
        <input
          className="outline-none border border-primary rounded-md mb-4 px-2 py-2 "
          id="amount"
          name="amount"
          placeholder="Enter withdrawal amount"
        />

        <input
          className="outline-none border border-primary rounded-md mb-4 px-2 py-2 "
          id="mpesaNumber"
          name="mpesaNumber"
          placeholder="Enter M-PESA Number"
        />

        <label className="text-sm text-[lightGrey] " htmlFor="mpesaName">
          * Use exact order
        </label>
        <input
          className="outline-none border border-primary rounded-md mb-4 px-2 py-2 "
          id="mpesaName"
          name="mpesaName"
          placeholder="Enter M-PESA Name"
        />

        <button
          type="submit"
          className="w-56 rounded-full shadow-lg hover:bg-opacity-95 text-[#fff] bg-[#428541]  border"
        >
          {" "}
          Withdraw{" "}
        </button>
      </form>
    </>
  );
};
