import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ShoppingCart } from "../../../common/interfaces";
import { useAppContext } from "../../../contexts";
import * as Tabs from "@radix-ui/react-tabs";

const NairobiAgentForm = () => {
  return (
    <div>
      {" "}
      <label className="mx-auto block w-fit">
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        className="border-2 border-primary block mx-auto rounded-lg"
      >
        <option>Kiserian</option>
        <option>Jamhuri</option>
        <option>CBD</option>
      </select>
      <label className="mx-auto block w-fit">
        Mtaani agent <span className="text-error">*</span>{" "}
      </label>
      <select className="border-2 border-primary block mx-auto rounded-lg">
        <option>X-treme media</option>
        <option>shop direct</option>
        <option>philadelphia hse</option>
      </select>
    </div>
  );
};

export const CheckOutPage = () => {
  const { storeFrontId } = useParams();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({
    totalPrice: 0,
    products: [],
  });
  const { showToast } = useAppContext();

  const [deliveryOption, setDeliveryOption] = useState<
    "Nairobi Agents" | "Nairobi Doorstep" | "Outside Nairobi"
  >("Nairobi Agents");

  const tabs = [
    {
      label: "Nairobi Agents",
      value: "Nairobi Agents",
      component: <NairobiAgentForm />,
    },
    {
      label: "Nairobi Doorstep",
      value: "Nairobi Doorstep",
      component: <>nairobi doorstep</>,
    },
    {
      label: "Outside Nairobi",
      value: "Outside Nairobi",
      component: <>outside nairobi</>,
    },
  ];

  useEffect(() => {
    const cart = localStorage.getItem("shoppingCart");
    if (cart) {
      const temp = JSON.parse(cart);
      setShoppingCart(temp);
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
  }, []);

  const handleTab = (
    tab: "Nairobi Agents" | "Nairobi Doorstep" | "Outside Nairobi",
  ) => {
    setDeliveryOption(tab);
  };

  return (
    <div className="px-10 pb-40">
      <div className="mt-3   mb-4 ">
        <Link
          to={`/${storeFrontId}`}
          className="font-bold flex flex-row items-center justiify-start"
        >
          <LeftOutlined />
          Cancel
        </Link>
      </div>

      <div
        className=" border-grey border-y-2
      py-2"
      >
        <p className="font-bold text-lg">Order summary</p>
        <p className="inline-block mr-auto w-1/2  "> Number of Items </p>
        <p className="inline-block text-right ml-auto w-1/2  ">
          {" "}
          {`${shoppingCart.products.length}`}{" "}
        </p>

        <p className="inline-block mr-auto w-1/2  "> Delivery Option</p>
        <p className="inline-block text-right ml-auto w-1/2  ">
          {" "}
          {`${deliveryOption}`}{" "}
        </p>

        <Link to={`/${storeFrontId}/shopping-cart`}>
          <button
            className="block border-2 border-primary
        rounded-lg text-primary mx-auto px-10 "
          >
            {" "}
            MODIFY SHOPPING CART{" "}
          </button>
        </Link>
      </div>

      <div
        className=" border-grey border-b-2
      py-2"
      >
        <p className="font-bold text-lg">Delivery</p>

        <Tabs.Root className="TabsRoot" defaultValue="Nairobi Agents">
          <Tabs.List className="shrink-0  flex" defaultValue="Nairobi Agents">
            {tabs.map(({ label, value }, index) => (
              <Tabs.Trigger
                key={index}
                className={`${
                  deliveryOption === value
                    ? "font-bold bg-primary text-[#fff] rounded-full"
                    : ""
                } select-none px-4 py-0.5`}
                value={value}
                onClick={() =>
                  handleTab(
                    value as
                      | "Nairobi Agents"
                      | "Nairobi Doorstep"
                      | "Outside Nairobi",
                  )
                }
              >
                {" "}
                {label}{" "}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {tabs.map(({ value, component }, index) => (
            <Tabs.Content key={index} className="w-full focus: " value={value}>
              {component}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
};
