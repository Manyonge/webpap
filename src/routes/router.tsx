import { createBrowserRouter } from "react-router-dom";
import { AdminLayout, AppLayout } from "../layouts";
import {
  Login,
  MarketPlace,
  NotFound,
  Pricing,
  Signup,
  WebpapHome,
} from "../pages";
import { AdminRoutes } from "./AdminRoutes.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <WebpapHome /> },
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
    ],
  },
]);
