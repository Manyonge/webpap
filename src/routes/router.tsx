import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout, AppLayout, StoreFrontLayout } from "../layouts";
import {
  Login,
  MarketPlace,
  NotFound,
  Pricing,
  Signup,
  WebpapHome,
} from "../pages";
import { AdminRoutes } from "./AdminRoutes.tsx";
import { StoreFrontRoutes } from "./StoreFrontRoutes.tsx";
import { useEffect, useState } from "react";
import { supabase } from "../supabase.ts";
import { useAppContext } from "../contexts/AppContext.tsx";
import { PostgrestError } from "@supabase/supabase-js";

const RequireAuth = (props: { children: any }) => {
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

      if (sessionData.session?.expires_at) {
        setIsSessionExpired(
          Math.floor(Date.now() / 1000) > sessionData.session?.expires_at,
        );
      }
    };
    authenticate().then();
  }, []);

  if (isSessionExpired) return <Navigate to={"/login"} />;

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <WebpapHome /> },
      { path: "404", element: <NotFound /> },

      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "market-place",
        element: <MarketPlace />,
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: ":storeFrontID/admin",
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [...AdminRoutes],
      },
      {
        path: ":storeFrontID",
        element: <StoreFrontLayout />,
        children: [...StoreFrontRoutes],
      },
    ],
  },
]);
