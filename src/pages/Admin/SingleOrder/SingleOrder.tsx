import { useState } from "react";
import { CartItem } from "../../../common/interfaces";
import { LeftOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

export const SingleOrder = () => {
  const [order, setOrder] = useState<CartItem>({
    productPhoto:
      "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    productName: "Jordan 1 lows",
    amountPaid: 3500,
    orderTime: "2022-7-1 10:31AM",
    customerName: "Arthur Manyonge",
    orderId: "iidufieuf",
    isFulFilled: false,
  });

  const { storeFrontID } = useParams();

  return (
    <div className="px-10 md:px-44 pt-10 ">
      <Link to={`/${storeFrontID}/admin/orders`}>
        <button className="flex flex-row items-center justify-center mb-4">
          {" "}
          <LeftOutlined />
          Back{" "}
        </button>
      </Link>
      <div className=" py-4 rounded-lg shadow-lg text-center ">
        <img
          src={order.productPhoto}
          className="rounded-lg h-44 w-44 mx-auto "
        />
        <p> {order.productName} </p>
        <p> {order.amountPaid} </p>
        <p> Ordered at {order.orderTime} </p>
      </div>

      <button className="  shadow-lg rounded-full mt-10 w-full text-[#fff] bg-[#416C85]">
        Fulfill
      </button>
    </div>
  );
};
