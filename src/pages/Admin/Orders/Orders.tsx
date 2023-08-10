import * as Tabs from "@radix-ui/react-tabs";
import { Order } from "../../../common/interfaces";
import { Link } from "react-router-dom";
import { RightOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { stringToDate } from "../../../common/utils";

const OrderPaper = (props: { order: Order }) => {
  const { order } = props;

  return (
    <Link to={`${order.id}`}>
      <div className=" mx-auto w-full rounded-lg shadow-lg hover:shadow-xl px-4 py-4 mb-6">
        <div className="flex flex-row items-center justify-between mb-3 ">
          <p
            className={`${
              order.isFulfilled ? "bg-success " : "bg-info "
            } rounded-full px-4 py-1 text-xs text-white `}
          >
            {" "}
            {order.isFulfilled ? "Fulfilled" : "New"}{" "}
          </p>

          <p className="ml-6 font-bold text-sm text-center ">
            {" "}
            {order.product.name}{" "}
          </p>
          <p className="font-bold text-sm text-center ">
            {" "}
            {stringToDate(order.created_at as string).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between mb-3 ">
          <img
            src={order.product.productImages[0].url}
            alt={`${order.product.name}`}
            className="h-14 md:h-20 w-14 md:w-20 rounded-md "
          />

          <p className="text-center text-sm  ">
            {" "}
            {order.product.price.toLocaleString()}
            {" KSH"}
          </p>
          <p className="text-center text-sm ">
            {" "}
            {`Ordered by ${order.customer.name} `}{" "}
          </p>
          <RightOutlined />
        </div>
      </div>
    </Link>
  );
};

export const Orders = () => {
  const { showToast } = useAppContext();

  const [selectedTab, setSelectedTab] = useState("allProducts");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<
    null | "fulfilled" | "unfulfilled"
  >(null);

  const fetchOrders = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (fulfillmentStatus === null) {
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("retailerId", sessionData.session?.user.id);

      if (error) {
        showToast(error.message);
        throw new Error(error.message);
      }
      return data;
    }

    if (fulfillmentStatus === "fulfilled") {
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("retailerId", sessionData.session?.user.id)
        .eq("isFulfilled", true);

      if (error) {
        showToast(error.message);
        throw new Error(error.message);
      }
      return data;
    }

    if (fulfillmentStatus === "unfulfilled") {
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("retailerId", sessionData.session?.user.id)
        .eq("isFulfilled", false);

      if (error) {
        showToast(error.message);
        throw new Error(error.message);
      }
      return data;
    }
  };

  const ordersQuery = useQuery(["orders", fulfillmentStatus], fetchOrders);

  const tabs: {
    label: string;
    value: string;
    fulfillmentStatus: null | "fulfilled" | "unfulfilled";
  }[] = [
    {
      label: "All",
      value: "allProducts",
      fulfillmentStatus: null,
    },
    {
      label: "New",
      value: "newProducts",
      fulfillmentStatus: "unfulfilled",
    },
    {
      label: "Fulfilled",
      value: "fulfilledProducts",
      fulfillmentStatus: "fulfilled",
    },
  ];

  const handleTab = (
    tab: string,
    status: null | "unfulfilled" | "fulfilled",
  ) => {
    setSelectedTab(tab);
    setFulfillmentStatus(status);
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
        <Tabs.List className=" shrink-0 mb-4 flex" defaultValue="allProducts">
          {tabs.map(({ label, value, fulfillmentStatus }) => (
            <Tabs.Trigger
              key={value}
              className={`${
                selectedTab === value
                  ? "font-bold bg-primary text-[#fff] rounded-lg"
                  : ""
              } select-none px-4 py-2`}
              value={value}
              onClick={() => handleTab(value, fulfillmentStatus)}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map(({ value }) => (
          <Tabs.Content key={value} className="w-full focus: " value={value}>
            {ordersQuery.data?.map((order) => (
              <OrderPaper key={order.id} order={order} />
            ))}
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <button
        onClick={handleScrollToTop}
        className="  bg-primary rounded-full shadow-2xl fixed bottom-32
         px-3 py-3 text-[#fff] flex flex-row items-center justify-center  right-10"
      >
        <UpOutlined />
      </button>
    </div>
  );
};
