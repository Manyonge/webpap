import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext.tsx";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../supabase.ts";
import { Navigate } from "react-router-dom";

export const RequireAuth = (props: { children: any }) => {
  const { children } = props;
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const { showToast } = useAppContext();

  const handleError = (error: PostgrestError | any | null) => {
    if (error) {
      showToast(error.message);
      throw new Error(error);
    }
  };
  useEffect(() => {
    const authenticate = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      handleError(sessionError);
      if (!sessionData.session) setIsSessionExpired(true);
    };
    authenticate().then();
  }, []);

  if (isSessionExpired) return <Navigate to={"/login"} />;

  return children;
};
