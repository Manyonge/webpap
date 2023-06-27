import { AdminDashboard } from "../pages/AdminDashboard/AdminDashboard.tsx";
import {
  Customers,
  EWallet,
  Orders,
  RetailerAccount,
  SingleOrder,
  SingleProduct,
  UploadedProducts,
  UploadProduct,
  Withdraw,
} from "../pages";

export const AdminRoutes = [
  {
    index: true,
    element: <AdminDashboard />,
  },
  {
    path: "customers",
    element: <Customers />,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "orders/:orderID",
    element: <SingleOrder />,
  },
  {
    path: "wallet",
    element: <EWallet />,
  },
  {
    path: "wallet/withdraw",
    element: <Withdraw />,
  },
  {
    path: "account",
    element: <RetailerAccount />,
  },
  {
    path: "products",
    element: <UploadedProducts />,
  },
  {
    path: "products/:productID",
    element: <SingleProduct />,
  },
  {
    path: "products/upload",
    element: <UploadProduct />,
  },
];
