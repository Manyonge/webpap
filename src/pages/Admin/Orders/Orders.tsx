import * as Tabs from "@radix-ui/react-tabs";
import { CartItem } from "../../../common";
import { Link } from "react-router-dom";
import { RightOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";

const OrderPaper = (props: { order: CartItem }) => {
  // TODO get orders from within this component and have a fulfillementStatus prop be passed so it can be used to get the types of orders needed
  const { order } = props;
  return (
    <Link to={`${order.orderId}`}>
      <div className=" mx-auto w-full rounded-lg shadow-lg hover:shadow-xl px-4 py-4 mb-6">
        <div className="flex flex-row items-center justify-between mb-3 ">
          <p
            className={`${
              order.isFulFilled ? "bg-[#428541] text-[#fff]" : "text-[#416C85]"
            } rounded-full px-4 py-1 text-xs `}
          >
            {" "}
            {order.isFulFilled ? "Fulfilled" : "New"}{" "}
          </p>

          <p className="text-center"> {order.productName} </p>
          <p className="text-center"> {order.orderTime} </p>
        </div>

        <div className="flex flex-row items-center justify-between mb-3 ">
          <img
            src={order.productPhoto}
            alt={`${order.productName}`}
            className="h-8 w-8"
          />

          <p className="text-center"> {order.amountPaid} </p>
          <p className="text-center"> {order.customerName} </p>
          <RightOutlined />
        </div>
      </div>
    </Link>
  );
};

export const Orders = () => {
  const [selectedTab, setSelectedTab] = useState("allProducts");

  const [allOrders, setAllOrders] = useState<CartItem[]>([
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },

    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
  ]);

  const [newOrders, setNewOrders] = useState([
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
  ]);
  const [fulfilledOrders, setFulfilledOrders] = useState([
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skhfah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skiah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
    {
      isFulFilled: true,
      amountPaid: 4000,
      customerName: "Arthur Manyonge",
      orderTime: " 2023-1-7 10:31 am",
      productName: "Air jordan 1s",
      orderId: "skah",
      productPhoto:
        "https://hustle.imgix.net/8wb0abtw2etmk90e6l6vidnjefe1w88d.jpeg?fit=crop&w=512&h=512",
    },
  ]);

  const tabs = [
    {
      label: "All",
      value: "allProducts",
      orders: allOrders,
    },
    {
      label: "New",
      value: "newProducts",
      orders: newOrders,
    },
    {
      label: "Fulfilled",
      value: "fulfilledProducts",
      orders: fulfilledOrders,
    },
  ];

  const handleTab = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <Tabs.Root
        className=" px-2 md:px-10 mt-10 flex flex-col items-center justify-center  "
        defaultValue="allProducts"
      >
        <Tabs.List
          className="border-b shrink-0 mb-4 flex"
          defaultValue="allProducts"
        >
          {tabs.map(({ label, value }) => (
            <Tabs.Trigger
              key={value}
              className={`${
                selectedTab === value
                  ? "font-bold bg-primary text-[#fff] rounded-lg"
                  : ""
              } select-none px-4 py-2`}
              value={value}
              onClick={() => handleTab(value)}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map(({ value, orders }) => (
          <Tabs.Content key={value} className="w-full focus: " value={value}>
            {orders.map((order) => (
              <OrderPaper key={order.orderId} order={order} />
            ))}
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <button
        onClick={handleScrollToTop}
        className="  bg-primary rounded-full shadow-2xl fixed bottom-32 px-3 py-3 text-[#fff] flex flex-row items-center justify-center  right-10"
      >
        <UpOutlined />
      </button>
    </div>
  );
};
