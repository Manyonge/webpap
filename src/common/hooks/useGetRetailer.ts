import { useEffect, useState } from "react";
import { supabase } from "../../supabase.ts";
import { useParams } from "react-router-dom";
import { PostgrestError } from "@supabase/supabase-js";
import { Retailer } from "../interfaces";

export const useGetRetailer = () => {
  const { storeFrontID } = useParams();
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [retailerError, setRetailerError] = useState<PostgrestError | null>(
    null,
  );

  useEffect(() => {
    const getRetailer = async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select()
        .eq("businessName", storeFrontID)
        .single();

      if (error) setRetailerError(error);
      if (data) setRetailer(data);
    };
    getRetailer().then();
  }, []);

  return { retailer, retailerError };
};
