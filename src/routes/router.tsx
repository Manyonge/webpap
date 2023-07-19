import { createBrowserRouter } from "react-router-dom";
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
        element: <AdminLayout />,
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
