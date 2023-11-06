import { useEffect, useState } from "react";
import { supabase } from "../../supabase.ts";
import { useParams } from "react-router-dom";
import { Retailer } from "../interfaces";
import { useAppContext } from "../../contexts";
import { SeverityColorEnum } from "../enums";

export const useGetRetailer = () => {
  const { storeFrontId } = useParams();
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const { supabaseFetcher, showToast } = useAppContext();
  useEffect(() => {
    const getRetailer = async () => {
      try {
        const data = await supabaseFetcher(
          supabase
            .from("retailers")
            .select()
            .eq("business_name", storeFrontId)
            .single(),
        );
        setRetailer(data);
      } catch (e: any) {
        showToast(e.message, SeverityColorEnum.Error);
        throw e;
      }
    };
    getRetailer().then();
  }, [storeFrontId, supabaseFetcher]);

  return { retailer };
};
