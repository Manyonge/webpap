import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Order, ShoppingCart } from "../../../common/interfaces";
import { useForm } from "react-hook-form";

const Carousel = (props: { images: string[] }) => {
  const { images } = props;

  const [currentImage, setCurrentImage] = useState(images[0]);

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

export const CheckOut = () => {
  const { storeFrontID } = useParams();
  const { register, watch } = useForm<Order>();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({
    totalPrice: 0,
    products: [],
  });
  const [cartImages, setCartImages] = useState<string[]>([]);

  useEffect(() => {
    const cart = localStorage.getItem("shoppingCart");
    if (cart) {
      const temp: ShoppingCart = JSON.parse(cart);
      setShoppingCart(temp);
      const images = [];
      for (const i in temp.products) {
        images.push(temp.products[i].productImages[1].url);
      }
      setCartImages(images);
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
  }, []);

  return (
    <div className="px-10 pb-40">
      <div className="mt-3   mb-4 ">
        <Link to={`/${storeFrontID}`} className="font-bold ">
          <LeftOutlined />
          Cancel
        </Link>
      </div>

      <p
        className="text-center text-lg
      mb-4
      "
      >
        {" "}
        {shoppingCart.products.length} ITEMS{" "}
      </p>

      <Carousel images={cartImages} />

      <div className="flex flex-row items-center justify-between">
        <p>TOTAL</p>
        <p> {`${shoppingCart.totalPrice} KSH`} </p>
      </div>

      <form>
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

        <input
          placeholder="Full name"
          {...register("customerName")}
          className="border-2 border-primary rounded-md
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
        />
      </form>
    </div>
  );
};
