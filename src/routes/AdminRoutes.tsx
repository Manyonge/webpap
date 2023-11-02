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
import { RequireAuth } from "../components";

export const AdminRoutes = [
  {
    index: true,
    element: (
      <RequireAuth>
        <AdminDashboard />
      </RequireAuth>
    ),
  },
  {
    path: "customers",
    element: (
      <RequireAuth>
        <Customers />
      </RequireAuth>
    ),
  },
  {
    path: "orders",
    element: (
      <RequireAuth>
        <Orders />
      </RequireAuth>
    ),
  },
  {
    path: "orders/:orderId",
    element: (
      <RequireAuth>
        <SingleOrder />
      </RequireAuth>
    ),
  },
  {
    path: "wallet",
    element: (
      <RequireAuth>
        <EWallet />
      </RequireAuth>
    ),
  },
  {
    path: "wallet/withdraw",
    element: (
      <RequireAuth>
        <Withdraw />
      </RequireAuth>
    ),
  },

  {
    path: "products",
    element: (
      <RequireAuth>
        <UploadedProducts />
      </RequireAuth>
    ),
  },
  {
    path: "products/:productID",
    element: (
      <RequireAuth>
        <SingleProduct />
      </RequireAuth>
    ),
  },
  {
    path: "products/upload",
    element: (
      <RequireAuth>
        <UploadProduct />
      </RequireAuth>
    ),
  },
];
