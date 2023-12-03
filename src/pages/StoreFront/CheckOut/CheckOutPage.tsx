import { Link, useNavigate, useParams } from "react-router-dom";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CheckOut, ShoppingCart } from "../../../common/interfaces";
import { useAppContext } from "../../../contexts";
import * as Tabs from "@radix-ui/react-tabs";
import { SeverityColorEnum } from "../../../common/enums";
import { supabase } from "../../../supabase.ts";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { useGetRetailer } from "../../../common/hooks/index.ts";
import * as Dialog from "@radix-ui/react-dialog";
import { LoadingIndicator } from "../../../components/index.ts";
import axios from "axios";
import { io } from "socket.io-client";

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
    enabled: agentLocation !== "",
  });

  const handleName = (e: any) => {
    setAgentName(e.target.value);
  };

  const handleLocation = (e: any) => {
    setAgentLocation(e.target.value);
    setAgentName("");
  };

  return (
    <div>
      {" "}
      <label>
        Location <span className="text-error">*</span>{" "}
      </label>
      <select
        placeholder="Location"
        value={agentLocation}
        onChange={handleLocation}
        className="mb-3"
      >
        <option defaultChecked value="">
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
      <label>
        Mtaani agent <span className="text-error">*</span>{" "}
      </label>
      <select value={agentName} onChange={handleName}>
        <option defaultChecked value="">
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
      <label>
        Location <span className="text-error">*</span>{" "}
      </label>
      <input
        placeholder="Location"
        value={outsideLocation}
        onChange={handleLocation}
        className="mb-3"
      />
      <label>
        Courier service <span className="text-error">*</span>{" "}
      </label>
      <input
        value={outsideCourier}
        onChange={handleCourier}
        placeholder="Courier Service"
      />
    </div>
  );
};

export const CheckOutPage = () => {
  const { storeFrontId } = useParams();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({
    totalPrice: 0,
    products: [],
  });
  const [agentLocation, setAgentLocation] = useState("");
  const [agentName, setAgentName] = useState("");
  const [outsideLocation, setOutsideLocation] = useState("");
  const [outsideCourier, setOutsideCourier] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { retailer } = useGetRetailer();
  const navigate = useNavigate();

  const { showToast, supabaseFetcher } = useAppContext();
  const { register, watch } = useForm<CheckOut>();

  const [deliveryOption, setDeliveryOption] = useState<
    "Nairobi Agents" | "Outside Nairobi"
  >("Nairobi Agents");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [newOrder, setNewOrder] = useState<CheckOut | undefined>();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (deliveryOption === "Nairobi Agents") setDeliveryFee(210);
    if (deliveryOption === "Outside Nairobi") setDeliveryFee(420);
  }, [deliveryOption]);

  const handleTab = (tab: "Nairobi Agents" | "Outside Nairobi") => {
    setDeliveryOption(tab);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handlePlaceOrder = () => {
    const data = watch();
    data.deliveryFee = deliveryFee;

    if (data.name === "" || data.email === "" || data.phoneNumber === "") {
      showToast("Please fill in all fields", SeverityColorEnum.Error);
      return;
    }
    if (data.phoneNumber && data.phoneNumber?.length > 9) {
      showToast("phone number must be 9 digits long", SeverityColorEnum.Error);
      return;
    }
    data.phoneNumber = `254${data.phoneNumber}`;
    if (data.instagramHandle === "") data.instagramHandle = null;
    if (data.deliveryNotes === "") data.deliveryNotes = null;
    data.products = shoppingCart.products;
    data.totalPrice = shoppingCart.totalPrice + deliveryFee;
    data.retailerId = retailer?.id?.toString();
    data.storeFrontId = storeFrontId;

    switch (deliveryOption) {
      case "Nairobi Agents":
        if (agentName === "" || agentLocation === "") {
          showToast(
            "Please fill in all Nairobi agent delivery fields",
            SeverityColorEnum.Error,
          );
        } else {
          setNewOrder(data);
          setDialogOpen(true);
        }
        break;

      case "Outside Nairobi":
        if (outsideCourier === "" || outsideLocation === "") {
          showToast(
            "Please fill in all Outside Nairobi delivery fields",
            SeverityColorEnum.Error,
          );
        } else {
          setNewOrder(data);
          setDialogOpen(true);
        }
        break;
    }
  };
  const handlePayload = async (payload: any, initiateResponse: any) => {
    console.log({ payload, initiateResponse });
    if (
      payload.CheckoutRequestID === initiateResponse.data.CheckoutRequestID &&
      payload.ResultCode === 0
    ) {
      for (const i in shoppingCart.products) {
        await supabaseFetcher(
          supabase
            .from("products")
            .update({ stock: 0 })
            .eq("id", shoppingCart.products[i].id),
        );
      }

      await supabaseFetcher(
        supabase.from("customers").insert([
          {
            storefront_id: storeFrontId,
            retailer_id: retailer?.id,
            name: watch().name,
            phone_number: watch().phoneNumber,
            email_address: watch().email,
            instagram_handle: watch().instagramHandle,
          },
        ]),
      );

      await supabaseFetcher(
        supabase.from("orders").insert([
          {
            retailer_id: retailer?.id,
            storefront_id: storeFrontId,
            customer_name: watch().name,
            customer_phone: watch().phoneNumber,
            customer_email: watch().email,
            customer_instagram: watch().instagramHandle,
            is_fulfilled: false,
            products: shoppingCart.products,
            delivery_option: deliveryOption,
            agent_name: agentName,
            agent_location: agentLocation,
            outside_location: outsideLocation,
            outside_courier: outsideCourier,
            delivery_fee: deliveryFee,
            total_price: deliveryFee + shoppingCart.totalPrice,
          },
        ]),
      );

      showToast("Order placed successfully", SeverityColorEnum.Success);
      navigate(`/${storeFrontId}`);
    } else {
      showToast(
        `${payload.ResultDesc}, Please try again`,
        SeverityColorEnum.Error,
      );
      setLoading(false);
      setDialogOpen(false);
    }
  };
  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const initiateResponse = await axios.post(
        "https://webpap-f8025.uc.r.appspot.com/payments/initiate",
        newOrder,
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` },
        },
      );
      console.log(initiateResponse);
      const socket = io("https://webpap-f8025.uc.r.appspot.com");
      socket.on("message", (payload) => {
        handlePayload(payload, initiateResponse);
      });
    } catch (e: any) {
      if (e.message === "Network Error") {
        showToast(
          "You seem to have lost your connection",
          SeverityColorEnum.Error,
        );
        setLoading(false);
      }
      showToast(e.message, SeverityColorEnum.Error);
    }
  };

  return (
    <div className="w-11/12 md:w-3/4 mx-auto mb-14">
      <Dialog.Root open={dialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="DialogOverlay opacity-30
            fixed inset-0 bg-black "
          />
          <Dialog.Content
            className="DialogContent w-2/3 bg-white rounded-lg shadow-lg
           fixed top-1/2 left-1/2 focus:outline-none
            py-4 px-7
            "
          >
            <Dialog.Title className="text-center text-lg mb-3">
              Confirm Your Order
            </Dialog.Title>

            <p className="flex flex-row items-center justify-between ">
              {" "}
              <span>M-PESA Number</span>
              <span> {`254${watch().phoneNumber}`} </span>{" "}
            </p>

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

            <p className="flex flex-row items-center justify-between ">
              {" "}
              <span>Delivery Fee</span>
              <span> {`KSH ${deliveryFee}`} </span>{" "}
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

            <div className="flex flex-row items-center justify-evenly mt-2">
              <button
                disabled={loading}
                onClick={handleCloseDialog}
                className="text-white bg-error px-2 rounded-lg disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSubmitOrder}
                className="text-white bg-success px-2 rounded-lg disabled:opacity-40"
              >
                {!loading && "Confirm"}
                {loading && (
                  <LoadingIndicator heightWidthXs={20} heightWidthMd={30} />
                )}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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

        <p className="flex flex-row items-center justify-between ">
          {" "}
          <span>Delivery Fee</span>
          <span> {`KSH ${deliveryFee}`} </span>{" "}
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

        <Link to={`/${storeFrontId}/shopping-cart`}>
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
          <Tabs.List
            className="shrink-0 mb-3 flex"
            defaultValue="Nairobi Agents"
          >
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
        className="
      py-2"
      >
        <p className="font-semibold text-lg">Contact details</p>
        <label>
          Name <span className="text-error">*</span>{" "}
        </label>
        <input {...register("name")} className="mb-2" />

        <label>
          Phone number <span className="text-error">*</span>{" "}
        </label>
        <input
          value="254"
          placeholder="254"
          disabled
          className="inline w-1/12 text-center opacity-60"
        />

        <input
          type="number"
          {...register("phoneNumber")}
          className="inline w-11/12 "
        />
        <p className="mb-2 text-center text-xs text-grey">
          *This number will be prompted for lipa na mpesa
          <br />
          Ensure your input starts with 7 and is 9 digits long
        </p>

        <label>
          Email <span className="text-error">*</span>{" "}
        </label>
        <input {...register("email")} className="mb-2 " />

        <label>Instagram Handle</label>
        <input {...register("instagramHandle")} className="mb-2" />

        <label>Delivery Notes</label>
        <input {...register("deliveryNotes")} className="mb-2" />
      </div>

      <button
        onClick={handlePlaceOrder}
        className="btn-primary w-full mt-5
      "
      >
        Place Order
      </button>
    </div>
  );
};
