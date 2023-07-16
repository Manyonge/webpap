import { Link, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Product, ShoppingCart } from "../../../common/interfaces";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

const Carousel = (props: {
  images: { url: string; fileName: string }[] | undefined;
}) => {
  const { images } = props;
  const [selectedImage, setSelectedImage] = useState(images[0]?.url);
  const handleChooseImage = (url: string) => {
    setSelectedImage(url);
  };

  return (
    <div className="flex flex-col">
      <img src={selectedImage} className="h-72  w-72 object-contain mx-auto" />

      <div
        className="flex flex-row items-center justify-around overflow-x-scroll
      mt-3 mx-auto "
      >
        {images?.map(({ url }, index) => (
          <img
            key={index}
            src={url}
            onClick={() => handleChooseImage(url)}
            className="object-cover h-14 w-14 mr-2"
          />
        ))}
      </div>
    </div>
  );
};

export const ProductView = () => {
  const params = useParams();
  const storeFrontID = params.storeFrontID as string;
  const productID = params.productID as string;
  const { showToast } = useAppContext();
  const [isInCart, setIsInCart] = useState(false);
  const [currentCart, setCurrentCart] = useState<ShoppingCart>();

  useEffect(() => {
    const storageCart = localStorage.getItem("shoppingCart");
    if (storageCart) {
      const cart: ShoppingCart = JSON.parse(storageCart);
      setCurrentCart(cart);
      const product = cart.products.find(
        (product) => product.id === parseInt(productID),
      );
      if (product) {
        setIsInCart(true);
      } else {
        setIsInCart(false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentCart) {
      localStorage.setItem("shoppingCart", JSON.stringify(currentCart));
    }
  }, [currentCart]);

  const fetchProduct = async () => {
    const {
      data,
      error,
    }: { data: Product | null; error: PostgrestError | null } = await supabase
      .from("products")
      .select()
      .eq("id", productID)
      .single();

    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };
  const productQuery = useQuery(["product"], fetchProduct);

  const handleAddToCart = async (product: Product | undefined | null) => {
    if (currentCart) {
      const temp: ShoppingCart = JSON.parse(JSON.stringify(currentCart));
      temp.products.push(product as Product);
      temp.totalPrice += product?.price as number;
      setCurrentCart(temp);
      setIsInCart(true);
    } else {
      setCurrentCart({
        totalPrice: product?.price as number,
        products: [product as Product],
      });
      setIsInCart(true);
    }
  };

  const handleRemoveFromCart = async (product: Product | undefined | null) => {
    if (currentCart) {
      const temp = JSON.parse(JSON.stringify(currentCart));
      temp.products = temp.products.filter(
        (product: Product) => product.id !== parseInt(productID),
      );
      if (product?.price) {
        temp.totalPrice = temp.totalPrice - product?.price;
      }
      setCurrentCart(temp);
      setIsInCart(false);
    }
  };

  if (productQuery.isLoading) return <></>;

  return (
    <div className="px-2 pt-6 pb-40">
      <Link
        to={`/${storeFrontID}`}
        className="flex flex-row items-center justify-start
       font-bold mb-4
      "
      >
        <LeftOutlined />
        <p>Back</p>
      </Link>

      <div className="px-2 py-2 rounded-lg shadow-xl  ">
        <p> {productQuery.data?.name} </p>
        <p> {productQuery.data?.category} </p>

        {productQuery.data !== undefined && (
          <Carousel images={productQuery.data?.productImages} />
        )}

        <div className="flex flex-row items-center justify-between">
          <p> {`Size: ${productQuery.data?.size}`} </p>
          <p> {`Condition: ${productQuery.data?.condition}`} </p>
        </div>

        <p className="text-center"> {productQuery.data?.description} </p>

        <div className="flex flex-row items-center justify-between">
          <p> {productQuery.data?.price} </p>

          {parseInt(productQuery.data?.stock as string) < 1 && (
            <button
              className=" mx-auto rounded-full py-1 px-3
        bg-error text-white text-sm mb-2 "
            >
              SOLD OUT
            </button>
          )}

          {isInCart && (
            <button
              className=" ml-auto rounded-full py-1 px-3
        bg-error text-white text-sm mb-2 "
              onClick={() => handleRemoveFromCart(productQuery?.data)}
            >
              Remove from cart
            </button>
          )}

          {parseInt(productQuery.data?.stock as string) > 0 && !isInCart ? (
            <button
              className="  rounded-full py-1 px-3
        bg-primary text-white text-sm mb-2 shadow-lg hover:shadow-xl "
              onClick={() => handleAddToCart(productQuery.data)}
            >
              ADD TO BAG
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
