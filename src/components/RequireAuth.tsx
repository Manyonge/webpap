import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../contexts";
import { supabase } from "../supabase.ts";

export const RequireAuth = (props: { children: any }) => {
  const { children } = props;
  const { supabaseFetcher } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const sessionData = await supabaseFetcher(supabase.auth.getSession());
      if (!sessionData.session || !sessionData.session.user) navigate("/login");
    };
    checkLogin().then();
  });

  return <> {children} </>;
};
