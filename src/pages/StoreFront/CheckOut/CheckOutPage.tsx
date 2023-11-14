import { Link, useParams } from "react-router-dom";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ShoppingCart } from "../../../common/interfaces";
import { useAppContext } from "../../../contexts";
import * as Tabs from "@radix-ui/react-tabs";

const NairobiAgentForm = (props: {
  agentName: string;
  agentLocation: string;
  setAgentName: any;
  setAgentLocation: any;
}) => {
  const { agentName, agentLocation, setAgentLocation, setAgentName } = props;

  const handleName = (e: any) => {
    setAgentName(e.target.value);
  };

  const handleLocation = (e: any) => {
    setAgentLocation(e.target.value);
  };

  return (
    <div>
      {" "}
      <label className="mx-auto block w-fit">
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        value={agentLocation}
        onChange={handleLocation}
        className="border-2 border-primary block mx-auto rounded-lg"
      >
        <option value="Kiserian">Kiserian</option>
        <option value="Jamhuri">Jamhuri</option>
        <option value="CBD">CBD</option>
      </select>
      <label className="mx-auto block w-fit">
        Mtaani agent <span className="text-error">*</span>{" "}
      </label>
      <select
        value={agentName}
        onChange={handleName}
        className="border-2 border-primary block mx-auto rounded-lg"
      >
        <option defaultChecked value="X-treme media">
          X-treme media
        </option>
        <option value="shop direct">shop direct</option>
        <option value="philadelphia hse">philadelphia hse</option>
      </select>
    </div>
  );
};

const OutOfNairobiForm = (props: {
  outsideLocation: string;
  outsideCourier: string;
  setOutsideCourier: any;
  setOutsideLocation: any;
}) => {
  const {
    outsideLocation,
    outsideCourier,
    setOutsideLocation,
    setOutsideCourier,
  } = props;

  const handleCourier = (e: any) => {
    setOutsideCourier(e.target.value);
  };

  const handleLocation = (e: any) => {
    setOutsideLocation(e.target.value);
  };

  return (
    <div>
      {" "}
      <label className="mx-auto block w-fit">
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        value={outsideLocation}
        onChange={handleLocation}
        className="border-2 border-primary block mx-auto rounded-lg"
      >
        <option value="Moyale">Moyale</option>
        <option value="Kisumu">Kisumu</option>
        <option value="Kisii">Kisii</option>
      </select>
      <label className="mx-auto block w-fit">
        Courier service <span className="text-error">*</span>{" "}
      </label>
      <select
        value={outsideCourier}
        onChange={handleCourier}
        className="border-2 border-primary block mx-auto rounded-lg"
      >
        <option value="Easy coach">Easy coach</option>
        <option value="2NK">2NK</option>
        <option value="Molo line">Molo line</option>
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
  const [agentLocation, setAgentLocation] = useState("...");
  const [agentName, setAgentName] = useState("...");
  const [outsideLocation, setOutsideLocation] = useState("...");
  const [outsideCourier, setOutsideCourier] = useState("...");

  const { showToast } = useAppContext();

  const [deliveryOption, setDeliveryOption] = useState<
    "Nairobi Agents" | "Nairobi Doorstep" | "Outside Nairobi"
  >("Nairobi Agents");

  const tabs = [
    {
      label: "Nairobi Agents",
      value: "Nairobi Agents",
      component: (
        <NairobiAgentForm
          agentLocation={agentLocation}
          agentName={agentName}
          setAgentLocation={setAgentLocation}
          setAgentName={setAgentName}
        />
      ),
    },
    {
      label: "Nairobi Doorstep",
      value: "Nairobi Doorstep",
      component: <p className="text-error">Coming soon!!!</p>,
    },
    {
      label: "Outside Nairobi",
      value: "Outside Nairobi",
      component: (
        <OutOfNairobiForm
          outsideLocation={outsideLocation}
          outsideCourier={outsideCourier}
          setOutsideCourier={setOutsideCourier}
          setOutsideLocation={setOutsideLocation}
        />
      ),
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

        {deliveryOption === "Nairobi Agents" && (
          <>
            <p className="inline-block mr-auto w-1/2  "> Agent Location</p>
            <p className="inline-block text-right ml-auto w-1/2  ">
              {" "}
              {`${agentLocation}`}{" "}
            </p>
          </>
        )}

        {deliveryOption === "Nairobi Agents" && (
          <>
            <p className="inline-block mr-auto w-1/2  "> Agent Name</p>
            <p className="inline-block text-right ml-auto w-1/2  ">
              {" "}
              {`${agentName}`}{" "}
            </p>
          </>
        )}

        {deliveryOption === "Outside Nairobi" && (
          <>
            <p className="inline-block mr-auto w-1/2  "> Location</p>
            <p className="inline-block text-right ml-auto w-1/2  ">
              {" "}
              {`${outsideLocation}`}{" "}
            </p>
          </>
        )}

        {deliveryOption === "Outside Nairobi" && (
          <>
            <p className="inline-block mr-auto w-1/2  "> Courier Service</p>
            <p className="inline-block text-right ml-auto w-1/2  ">
              {" "}
              {`${outsideCourier}`}{" "}
            </p>
          </>
        )}

        <Link to={`/${storeFrontId}/shopping-cart`}>
          <button
            className="block border-2 border-primary
        rounded-lg text-primary mx-auto px-10
        flex items-center justify-center"
          >
            {" "}
            MODIFY SHOPPING CART <EditOutlined />
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

      <div
        className=" border-grey border-b-2
      py-2"
      >
        <p className="font-bold text-lg">Contact details</p>
        <label className="mx-auto block w-fit">
          Name <span className="text-error">*</span>{" "}
        </label>
        <input className="border-2 border-primary block mx-auto rounded-lg" />

        <label className="mx-auto block w-fit">
          Phone number <span className="text-error">*</span>{" "}
        </label>
        <input className="border-2 border-primary block mx-auto rounded-lg" />

        <label className="mx-auto block w-fit">
          Email <span className="text-error">*</span>{" "}
        </label>
        <input className="border-2 border-primary block mx-auto rounded-lg" />

        <label className="mx-auto block w-fit">Instagram Handle</label>
        <input className="border-2 border-primary block mx-auto rounded-lg" />
      </div>

      <button
        className="block mx-auto bg-primary text-white
      rounded-lg
      "
      >
        Place Order
      </button>
    </div>
  );
};
