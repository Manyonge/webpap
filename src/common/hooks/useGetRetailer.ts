import { useEffect, useState } from "react";
import { supabase } from "../../supabase.ts";
import { useParams } from "react-router-dom";
import { Retailer } from "../interfaces";
import { useAppContext } from "../../contexts";

export const useGetRetailer = () => {
  const { storeFrontId } = useParams();
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const { supabaseFetcher } = useAppContext();
  useEffect(() => {
    const getRetailer = async () => {
      const data = await supabaseFetcher(
        supabase
          .from("retailers")
          .select()
          .eq("business_name", storeFrontId)
          .single(),
      );
      setRetailer(data);
    };
    getRetailer().then();
  }, [storeFrontId, supabaseFetcher]);

  return { retailer };
};
