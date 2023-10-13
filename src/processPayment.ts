import axios from "axios";

export const processPayment = async () => {
  // const { data: sessionData } = await supabase.auth.getSession();
  // const {
  //   data: retailer,
  //   error: retailerError,
  // }: { data: Retailer | null; error: PostgrestError | null } = await supabase
  //   .from("retailers")
  //   .select()
  //   .eq("id", sessionData.session?.user.id)
  //   .single();
  //
  // if (retailerError) {
  //   throw new Error(retailerError.message);
  // }

  //submit mpesa request
  const username = `${import.meta.env.VITE_KEY}`;
  const password = `${import.meta.env.VITE_SECRET}`;
  const response = axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate",

    {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
      params: {
        grant_type: "client_credentials",
      },
    },
  );

  console.log(response);

  return true;
};
