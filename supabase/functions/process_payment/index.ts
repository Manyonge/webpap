import { CheckOut } from "../../../src/common/interfaces/index.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const username = Deno.env.get("MPESA_CONSUMER_KEY");
const password = Deno.env.get("MPESA_CONSUMER_SECRET");
const BusinessShortCode = Number(Deno.env.get("MPESA_SHORTCODE"));
const supabase = createClient(
  Deno.env.get("VITE_PROJECT_URL"),
  Deno.env.get("VITE_API_KEY"),
);
const tokenUrl =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

const initiateUrl =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

const tokenHeaders = new Headers({
  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const data: CheckOut = await req.json();
    const tokenResponse = await fetch(tokenUrl, {
      headers: tokenHeaders,
      method: "GET",
    });
    const { access_token } = await tokenResponse.json();

    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

    const Password = btoa(
      `${BusinessShortCode}bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`,
    );

    const initiatePayment = {
      BusinessShortCode: BusinessShortCode,
      Password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1,
      PartyA: Deno.env.get("MPESA_PHONE_NUMBER"),
      PartyB: BusinessShortCode,
      PhoneNumber: data.phoneNumber,
      CallBackURL: `${Deno.env.get("PAYMENT_CALLBACK_URL")}`,
      AccountReference: "Webpap For dripventory",
      TransactionDesc: "Payment for order",
    };

    const initiateHeaders = new Headers();

    initiateHeaders.append("Content-Type", "application/json");
    initiateHeaders.append("Authorization", `Bearer ${access_token}`);

    const initiateResponse = await fetch(initiateUrl, {
      method: "POST",
      headers: initiateHeaders,
      body: JSON.stringify(initiatePayment),
    });

    const initiateJSON = await initiateResponse.json();

    if (initiateJSON.status === 200) {
      console.log(initiateJSON.initiateJSON.MerchantRequestID, access_token);
      supabase.from("stk_callbacks").insert(initiateJSON.Body.stkCallback);
    }

    return new Response(JSON.stringify({ name: data.name }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
