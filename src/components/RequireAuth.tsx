import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../contexts";
import { supabase } from "../supabase.ts";

export const RequireAuth = (props: { children: any }) => {
  const { children } = props;
  const params = useParams();
  const storeFrontId = params.storeFrontId as string;
  const { supabaseFetcher } = useAppContext();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const sessionData = await supabaseFetcher(supabase.auth.getSession());
      const retailer = await supabaseFetcher(
        supabase
          .from("retailers")
          .select()
          .eq("business_name", storeFrontId)
          .single(),
      );
      if (
        !sessionData.session ||
        (sessionData.session && sessionData.session.user.id !== retailer?.id)
      ) {
        navigate("/login");
      }
      setIsVerifying(false);
    };
    checkLogin().then();
  });
  if (isVerifying)
    return <p className="text-3xl font-bold text-center ">...</p>;
  return <> {children} </>;
};
