import { AdminDashboard } from "../pages/Admin/AdminDashboard/AdminDashboard.tsx";
import {
  Customers,
  EWallet,
  Orders,
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
