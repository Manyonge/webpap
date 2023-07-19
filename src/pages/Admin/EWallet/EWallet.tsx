import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";

export const EWallet = () => {
  const now = new Date();

  const [transactions, setTransacions] = useState([
    {
      transactionType: "Payment from Arthur Manyonge",
      transactionDate: now,
      amount: 50000,
    },
  ]);
  const { showToast } = useAppContext();
  const fetchRetailer = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    const {
      data,
      error,
    }: {
      data: { walletBalance: number } | null;
      error: null | PostgrestError;
    } = await supabase
      .from("retailers")
      .select("walletBalance")
      .eq("id", sessionData.session?.user.id)
      .single();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    console.log(data);
    return data;
  };

  const balanceQuery = useQuery("balance", fetchRetailer);

  return (
    <>
      <div className="bg-primary text-[#fff] md:text-center  mt-14 mb-10 mx-auto px-4 md:px-10 py-4 w-10/12 md:w-9/12 rounded-lg shadow-lg ">
        <div className="md:flex md:flex-row md:justify-between">
          <p className=" leading-7  font-bold text-lg md:text-2xl">
            Wallet balance
          </p>
          <p className=" leading-7  font-bold text-lg md:text-2xl">
            {`${balanceQuery.data?.walletBalance.toLocaleString()} KSH`}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between md:justify-center md:py-8 ">
          <p className="text-xs md:text-lg md:mr-4 "> 8% commission </p>
          <p className="text-xs md:text-lg md:ml-4 ">
            {" "}
            100 KSH per withdrawal{" "}
          </p>
        </div>
      </div>

      <Link
        to={"withdraw"}
        className="flex flex-row items-center justify-center mb-10 w-10/12 md:w-9/12 mx-auto "
      >
        <button className="bg-[#416C85] text-[#fff] rounded-full py-1 md:py-2 shadow-lg w-full ">
          {" "}
          Withdraw funds{" "}
        </button>
      </Link>

      <div className="overflow-x-auto px-2 w-10/12 md:w-9/12 mx-auto ">
        <table className="  md:w-full  ">
          <thead>
            <tr>
              <th>Transaction type</th>
              <th>Transaction date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(
              ({ transactionType, amount, transactionDate }, index) => (
                <tr key={index}>
                  <td> {transactionType} </td>
                  <td> {transactionDate.toDateString()} </td>
                  <td> {amount} </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
