import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { CartItem } from "../../../common/interfaces";
import { useState } from "react";

const OrderPaper = (props: { order: CartItem }) => {
  const { order } = props;
  return (
    <div
      className="rounded-lg shadow-lg px-3 py-2 mb-4
   flex flex-row items-center   justify-between "
    >
      <div className="">
        <img
          src={order.product.productImage}
          className="
        object-contain   w-20 h-20 "
        />
      </div>
      <div
        className="flex flex-col items-center justify-between
        w-1/3  "
      >
        <p className="text-center"> {order.product.name} </p>
        <p className="text-center"> {`Quantity: ${order.quantity}`} </p>
        <div>hello</div>
      </div>
      <div
        className="flex flex-col items-center justify-between
        w-1/3"
      >
        <p className="text-center"> {order.product.size} </p>
        <p className="text-center"> {order.product.price} </p>
        <button className="bg-error text-white py-1 w-full shadow-lg rounded-full">
          {" "}
          Remove{" "}
        </button>
      </div>
    </div>
  );
};

export const ShoppingCart = () => {
  const { storeFrontID } = useParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      quantity: 2,
      orderId: "erefefer",
      product: {
        name: "Jordan 1s",
        productImage:
          "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
        price: 2500,
        size: "42 EUR",
        stock: 1,
        isHidden: false,
        productId: "iufiduf",
        category: "Nike Dunks",
        condition: "Pre-loved",
        description: "This is the product description",
      },
    },
  ]);

  return (
    <div className="px-2 pt-10 pb-40">
      <Link
        to={`/${storeFrontID}`}
        className="flex flex-row items-center justify-start
       font-bold mb-4
      "
      >
        <LeftOutlined />
        <p>Continue Shopping</p>
      </Link>

      <p className="text-lg text-center font-bold mb-5 "> Shopping Cart </p>

      <div className="flex flex-row items-center justify-between mb-5">
        <p className="font-bold">TOTAL</p>
        <p className="font-bold"> 10,000 KSH </p>
      </div>

      <Link to={`/${storeFrontID}/checkout`} className="">
        <button className=" w-full rounded-full shadow-lg mb-12 bg-success text-white py-1 ">
          {" "}
          Check out{" "}
        </button>
      </Link>

      <div>
        {cartItems.map((order) => (
          <OrderPaper order={order} key={order.orderId} />
        ))}
      </div>
    </div>
  );
};
