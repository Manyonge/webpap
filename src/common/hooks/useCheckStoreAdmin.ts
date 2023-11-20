import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts";
import { supabase } from "../../supabase.ts";
import { SeverityColorEnum } from "../enums";

export const useCheckStoreAdmin = () => {
  const [isStoreAdmin, setIsStoreAdmin] = useState(false);
  const { storeFrontId } = useParams();
  const { supabaseFetcher, showToast } = useAppContext();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const sessionData = await supabaseFetcher(supabase.auth.getSession());
        const retailer = await supabaseFetcher(
          supabase
            .from("retailers")
            .select()
            .eq("business_name", storeFrontId)
            .single(),
        );
        if (
          sessionData.session &&
          sessionData.session.user.id === retailer?.id
        ) {
          setIsStoreAdmin(true);
        } else {
          setIsStoreAdmin(false);
        }
      } catch (e: any) {
        showToast(e.message, SeverityColorEnum.Error);
        throw e;
      }
    };
    checkLogin().then();
  });

  return { isStoreAdmin };
};
