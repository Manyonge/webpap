import {
  CheckOutPage,
  ProductView,
  ShoppingCartPage,
  StoreFrontHome,
} from "../pages";

export const StoreFrontRoutes = [
  {
    index: true,
    element: <StoreFrontHome />,
  },
  {
    path: "product/:productID",
    element: <ProductView />,
  },
  {
    path: "shopping-cart",
    element: <ShoppingCartPage />,
  },
  {
    path: "checkout",
    element: <CheckOutPage />,
  },
];
