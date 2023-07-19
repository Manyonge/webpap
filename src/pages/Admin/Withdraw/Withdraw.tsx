import { Retailer, Withdrawal } from "../../../common/interfaces";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { SeverityColorEnum } from "../../../common/enums";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

export const Withdraw = () => {
  const { watch, register } = useForm<Withdrawal>();
  const isWithdrawalConfirmed = true;
  const { showToast } = useAppContext();
  const fetchRetailer = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const {
      data,
      error,
    }: { data: Retailer | null; error: null | PostgrestError } = await supabase
      .from("retailers")
      .select()
      .eq("id", sessionData.session?.user.id)
      .single();

    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const retailerQuery = useQuery("retailer", fetchRetailer);
  const navigate = useNavigate();
  const params = useParams();
  const storeFrontID = params.storeFrontID as string;
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = watch();
    console.log(data);

    if (
      data.amount === "" ||
      data.mpesaName === "" ||
      data.mpesaNumber === ""
    ) {
      showToast("please fill in all details", SeverityColorEnum.Error);
      return;
    }

    if (isWithdrawalConfirmed && retailerQuery.data) {
      const { data: sessionData } = await supabase.auth.getSession();
      const update = {
        walletBalance: retailerQuery.data.walletBalance - data.amount,
      };
      const { error } = await supabase
        .from("retailers")
        .update(update)
        .eq("id", sessionData.session?.user.id);
      if (error) {
        showToast(error.message, SeverityColorEnum.Error);
        throw new Error(error.message);
      }
    }
    showToast("withdrawal made successfully", SeverityColorEnum.Success);
    navigate(`/${storeFrontID}/admin/wallet`);
  };

  return (
    <>
      <Link
        to={`/${storeFrontID}/admin/wallet`}
        className="flex flex-row items-center justify-start
         w-10/12 mx-auto mt-4 font-bold"
      >
        <LeftOutlined /> Cancel
      </Link>
      <div
        className="flex flex-row items-center justify-between bg-primary rounded-lg w-10/12
       text-[#fff] px-1 md:px-6  py-4 mt-10 mx-auto mb-20 md:text-xl shadow-lg "
      >
        <p> Your wallet balance </p>
        <p> {`${retailerQuery.data?.walletBalance} KSH `} </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center
      shadow-lg rounded-lg w-10/12 mx-auto py-10 "
      >
        <label className="text-sm text-[lightGrey] mt-2" htmlFor="amount">
          {" "}
          * 100 KSH per withdrawal{" "}
        </label>
        <input
          type="number"
          className="outline-none border border-primary rounded-md
          mb-4 px-2 py-2 w-9/12"
          {...register("amount")}
          placeholder="Enter withdrawal amount"
        />

        <input
          type="number"
          className="outline-none border border-primary rounded-md
          mb-4 px-2 py-2 w-9/12"
          {...register("mpesaNumber")}
          placeholder="Enter M-PESA Number"
        />

        <label className="text-sm text-[lightGrey] " htmlFor="mpesaName">
          * Use exact order
        </label>
        <input
          className="outline-none border border-primary rounded-md
          mb-4 px-2 py-2 w-9/12"
          {...register("mpesaName")}
          placeholder="Enter M-PESA Name"
        />

        <button
          type="submit"
          className="w-9/12 rounded-full shadow-lg hover:bg-opacity-95 text-[#fff] bg-[#428541]  border"
        >
          {" "}
          Withdraw{" "}
        </button>
      </form>
    </>
  );
};
