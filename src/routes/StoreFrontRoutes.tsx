import React from "react";

const CheckOutPage = React.lazy(
  () => import("../pages/StoreFront/CheckOut/CheckOutPage"),
);

const StoreFrontHome = React.lazy(
  () => import("../pages/StoreFront/StoreFrontHome/StoreFrontHome"),
);

const ShoppingCartPage = React.lazy(
  () => import("../pages/StoreFront/ShoppingCart/ShoppingCartPage"),
);

const ProductView = React.lazy(
  () => import("../pages/StoreFront/ProductView/ProductView"),
);

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
