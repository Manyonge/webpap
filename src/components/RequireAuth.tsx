import { useEffect, useState } from "react";
import { supabase } from "../supabase.ts";
import { Navigate } from "react-router-dom";

export const RequireAuth = (props: { children: any }) => {
  const { children } = props;
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) setIsSessionExpired(true);
    };
    authenticate().then();
  }, []);

  if (isSessionExpired) return <Navigate to={"/login"} />;

  return children;
};
