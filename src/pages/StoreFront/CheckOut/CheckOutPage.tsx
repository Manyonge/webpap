import { Link, useNavigate, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  CheckOut,
  Customer,
  Delivery,
  Order,
  Retailer,
  ShoppingCart,
} from "../../../common/interfaces";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";
import { supabase } from "../../../supabase.ts";
import { useQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

const Carousel = (props: { images: string[] }) => {
  const { images } = props;

  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    if (!currentImage) {
      setCurrentImage(images[0]);
    }
  }, []);

  const handleChangeImage = (image: string) => {
    setCurrentImage(image);
  };

  return (
    <div className="relative mx-auto w-max  ">
      <img
        src={currentImage}
        className="w-40 h-40 object-cover"
        alt="product images"
      />

      <div
        className="absolute bottom-2 flex flex-row w-full
         items-center justify-around "
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleChangeImage(image)}
            className="bg-white w-7 h-2  "
          ></div>
        ))}
      </div>
    </div>
  );
};

export const CheckOutPage = () => {
  const params = useParams();
  const storeFrontID = params.storeFrontID as string;
  const { register, watch } = useForm<CheckOut>();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({
    totalPrice: 0,
    products: [],
  });
  const [cartImages, setCartImages] = useState<string[]>([]);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(true);
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    const cart = localStorage.getItem("shoppingCart");
    if (cart) {
      const temp: ShoppingCart = JSON.parse(cart);
      setShoppingCart(temp);
      const images = [];
      for (const i in temp.products) {
        images.push(temp.products[i].productImages[0].url);
      }
      setCartImages(images);
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
  }, []);

  const fetchRetailer = async () => {
    const {
      data: retailer,
      error: retailerError,
    }: { data: Retailer | null; error: PostgrestError | null } = await supabase
      .from("retailers")
      .select()
      .eq("businessName", storeFrontID)
      .single();
    if (retailerError) {
      showToast(retailerError.message);
      throw new Error(retailerError.message);
    }
    return retailer;
  };

  const retailerQuery = useQuery(["retailer"], fetchRetailer);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = watch();

    if (
      data.customerName === "" ||
      data.customerPhoneNumber === "" ||
      data.customerEmailAddress === "" ||
      data.mpesaNumber === "" ||
      data.pickupAgent === "" ||
      data.pickupLocation === ""
    ) {
      showToast("Please fill in all details", SeverityColorEnum.Error);
      return;
    }

    const customer: Customer = {
      name: data.customerName,
      phoneNumber: data.customerPhoneNumber,
      emailAddress: data.customerEmailAddress,
      storeFrontId: storeFrontID,
      retailerId: retailerQuery.data?.id as string,
    };

    const delivery: Delivery = {
      pickupLocation: data.pickupLocation,
      pickupAgent: data.pickupAgent,
    };

    if (isPaymentConfirmed) {
      //reduce product's stock
      for (const i in shoppingCart.products) {
        const newStock = parseInt(shoppingCart.products[i].stock as string) - 1;
        const { error: productError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", shoppingCart.products[i].id)
          .select();
        if (productError) {
          showToast(productError.message);
          throw new Error(productError.message);
        }
      }

      //add retailer's wallet balance
      const newRetailer: Retailer = JSON.parse(
        JSON.stringify(retailerQuery.data),
      );
      newRetailer.walletBalance =
        newRetailer.walletBalance + shoppingCart.totalPrice;

      const { error: updateError } = await supabase
        .from("retailers")
        .update(newRetailer)
        .eq("businessName", storeFrontID)
        .select();

      if (updateError) {
        showToast(updateError.message);
        throw new Error(updateError.message);
      }

      //create order
      for (const i in shoppingCart.products) {
        const order: Order = {
          retailerId: retailerQuery.data?.id as string,
          storeFrontId: storeFrontID,
          product: shoppingCart.products[i],
          isFulfilled: false,
          delivery,
          customer,
        };
        const { error: orderError } = await supabase
          .from("orders")
          .insert(order);
        if (orderError) {
          showToast(orderError.message);
          throw new Error(orderError.message);
        }
      }

      //create customer
      const { error: customerError } = await supabase
        .from("customers")
        .insert(customer);
      if (customerError) {
        showToast(customerError.message);
        throw new Error(customerError.message);
      }
      localStorage.removeItem("shoppingCart");
      showToast("order created successfully!", SeverityColorEnum.Success);
      navigate(`/${storeFrontID}`);
    }
  };

  return (
    <div className="px-10 pb-40">
      <div className="mt-3   mb-4 ">
        <Link to={`/${storeFrontID}`} className="font-bold ">
          <LeftOutlined />
          Cancel
        </Link>
      </div>

      <p className="text-center text-lg mb-4">
        {" "}
        {shoppingCart.products.length} ITEMS{" "}
      </p>

      <Carousel images={cartImages} />

      <div className="flex flex-row items-center justify-between">
        <p>TOTAL</p>
        <p> {`${shoppingCart.totalPrice} KSH`} </p>
      </div>

      <form className="flex flex-col items-center " onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          {...register("customerName")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />

        <input
          placeholder="Phone number"
          {...register("customerPhoneNumber")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />

        <input
          placeholder="Email Address"
          {...register("customerEmailAddress")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />

        <textarea
          placeholder="delivery notes"
          {...register("deliveryNotes")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />

        <select
          {...register("pickupLocation")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        >
          <option value="" defaultChecked hidden>
            Pickup location
          </option>
          <option>hello</option>
        </select>

        <select
          {...register("pickupAgent")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        >
          <option value="" defaultChecked hidden>
            Pickup Agent
          </option>
          <option>hello</option>
        </select>

        <input
          placeholder="M-PESA number"
          {...register("mpesaNumber")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />
        <p className="text-center text-grey text-sms">
          This number will be prompted for payment
        </p>

        <button
          type="submit"
          className="bg-success text-white shadow-lg rounded-lg
          w-full py-1"
        >
          {" "}
          {`PAY KSH ${shoppingCart.totalPrice}`}{" "}
        </button>
      </form>
    </div>
  );
};
