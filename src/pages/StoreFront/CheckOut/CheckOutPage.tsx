import { Link, useParams } from "react-router-dom";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ShoppingCart } from "../../../common/interfaces";
import { useAppContext } from "../../../contexts";
import * as Tabs from "@radix-ui/react-tabs";
import { SeverityColorEnum } from "../../../common/enums";
import { supabase } from "../../../supabase.ts";
import { useQuery } from "react-query";

const NairobiAgentForm = (props: {
  agentName: string;
  agentLocation: string;
  setAgentName: any;
  setAgentLocation: any;
}) => {
  const { agentName, agentLocation, setAgentLocation, setAgentName } = props;
  const { showToast, supabaseFetcher } = useAppContext();
  const fetchLocations = async () => {
    try {
      return await supabaseFetcher(
        supabase.from("pickup mtaani locations").select(),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const fetchAgents = async () => {
    try {
      return await supabaseFetcher(
        supabase
          .from("pickup mtaani agents")
          .select()
          .eq("location", agentLocation),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const locationsQuery = useQuery(["locations"], { queryFn: fetchLocations });
  const agentsQuery = useQuery(["agents", agentLocation], {
    queryFn: fetchAgents,
    enabled: agentLocation !== "...",
  });

  const handleName = (e: any) => {
    setAgentName(e.target.value);
  };

  const handleLocation = (e: any) => {
    setAgentLocation(e.target.value);
    setAgentName("...");
  };

  return (
    <div>
      {" "}
      <label className="">
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        value={agentLocation}
        onChange={handleLocation}
        className=""
      >
        <option defaultChecked value="...">
          {" "}
          Select a location{" "}
        </option>
        {locationsQuery.data?.length > 0 &&
          locationsQuery.data.map(({ name, id }: any) => (
            <option key={id} value={name}>
              {" "}
              {name}{" "}
            </option>
          ))}
      </select>
      <label className="">
        Mtaani agent <span className="text-error">*</span>{" "}
      </label>
      <select value={agentName} onChange={handleName} className="">
        <option defaultChecked value="...">
          {" "}
          Select an agent{" "}
        </option>
        {agentsQuery.data?.length > 0 &&
          agentsQuery.data.map(({ agent_name, id }: any) => (
            <option key={id} value={agent_name}>
              {" "}
              {agent_name}{" "}
            </option>
          ))}
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
      <label className="">
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        value={outsideLocation}
        onChange={handleLocation}
        className=""
      >
        <option value="Moyale">Moyale</option>
        <option value="Kisumu">Kisumu</option>
        <option value="Kisii">Kisii</option>
      </select>
      <label className="">
        Courier service <span className="text-error">*</span>{" "}
      </label>
      <select value={outsideCourier} onChange={handleCourier} className="">
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const { showToast } = useAppContext();

  const [deliveryOption, setDeliveryOption] = useState<
    "Nairobi Agents" | "Outside Nairobi"
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

  const handleTab = (tab: "Nairobi Agents" | "Outside Nairobi") => {
    setDeliveryOption(tab);
  };

  const handlePlaceOrder = () => {
    switch (deliveryOption) {
      case "Nairobi Agents":
        if (agentName === "..." || agentLocation === "...") {
          showToast(
            "Please fill in all Nairobi agent delivery fields",
            SeverityColorEnum.Error,
          );
        } else {
          setDialogOpen(true);
          showToast("hello", SeverityColorEnum.Success);
        }
        break;

      case "Outside Nairobi":
        if (outsideCourier === "..." || outsideLocation === "...") {
          showToast(
            "Please fill in all Outside Nairobi delivery fields",
            SeverityColorEnum.Error,
          );
        } else {
          setDialogOpen(true);
        }
        break;
    }
  };

  // document.addEventListener("click", (event) => {
  //   if (!dialog?.contains(event.target as Node) && dialogOpen) {
  //     setDialogOpen(false);
  //   }
  // });

  return (
    <div className="px-10 pb-40">
      <Link
        to={`/${storeFrontId}`}
        className="flex flex-row items-center justiify-start
          my-2"
      >
        <LeftOutlined />
        Cancel
      </Link>

      <div
        className=" border-grey border-b-2
      pb-4 "
      >
        <p className="font-semibold text-lg">Order summary</p>
        <p className="flex flex-row items-center justify-between ">
          {" "}
          <span>Number of Items</span>
          <span> {`${shoppingCart.products.length}`} </span>{" "}
        </p>

        <p className="flex flex-row items-center justify-between ">
          {" "}
          <span>Delivery Option</span>
          <span> {deliveryOption} </span>{" "}
        </p>

        {deliveryOption === "Nairobi Agents" && (
          <p className="flex flex-row items-center justify-between ">
            {" "}
            <span>Agent Location</span>
            <span> {agentLocation} </span>{" "}
          </p>
        )}

        {deliveryOption === "Nairobi Agents" && (
          <p className="flex flex-row items-center justify-between ">
            {" "}
            <span>Agent Name</span>
            <span> {agentName} </span>{" "}
          </p>
        )}

        {deliveryOption === "Outside Nairobi" && (
          <p className="flex flex-row items-center justify-between ">
            {" "}
            <span>Location</span>
            <span> {outsideLocation} </span>{" "}
          </p>
        )}

        {deliveryOption === "Outside Nairobi" && (
          <p className="flex flex-row items-center justify-between ">
            {" "}
            <span>Courier Service</span>
            <span> {outsideCourier} </span>{" "}
          </p>
        )}

        <Link to={`/${storeFrontId}/shopping-cart`} className="">
          <button
            className="border-2 border-primary
        rounded-lg text-primary  px-10 mx-auto
        flex items-center justify-center"
          >
            {" "}
            MODIFY SHOPPING CART <EditOutlined />
          </button>
        </Link>
      </div>

      <div
        className=" border-grey border-b-2
      pb-4 h-52"
      >
        <p className="font-semibold text-lg">Delivery</p>

        <Tabs.Root className="TabsRoot" defaultValue="Nairobi Agents">
          <Tabs.List className="shrink-0  flex" defaultValue="Nairobi Agents">
            {tabs.map(({ label, value }, index) => (
              <Tabs.Trigger
                key={index}
                className={`${
                  deliveryOption === value
                    ? " bg-primary text-[#fff] rounded-lg"
                    : ""
                } select-none px-4 py-0.5`}
                value={value}
                onClick={() =>
                  handleTab(value as "Nairobi Agents" | "Outside Nairobi")
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
        <label className="">
          Name <span className="text-error">*</span>{" "}
        </label>
        <input className="" />

        <label className="">
          Phone number <span className="text-error">*</span>{" "}
        </label>
        <input className="" />

        <label className="">
          Email <span className="text-error">*</span>{" "}
        </label>
        <input className="" />

        <label className="">Instagram Handle</label>
        <input className="" />
      </div>

      <button
        onClick={handlePlaceOrder}
        className="block mx-auto bg-primary text-white
      rounded-lg
      "
      >
        Place Order
      </button>

      <dialog open={dialogOpen} className="border-error border-2">
        <p>hello world </p>
      </dialog>
    </div>
  );
};
