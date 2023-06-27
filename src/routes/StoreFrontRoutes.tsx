import { CheckOut, ProductView, ShoppingCart, StoreFrontHome } from "../pages";

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
    element: <ShoppingCart />,
  },
  {
    path: "checkout",
    element: <CheckOut />,
  },
];
