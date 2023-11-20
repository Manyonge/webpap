import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product, ShoppingCart } from "../../../common/interfaces";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts";
import { useQuery } from "react-query";
import { useLoadingImage } from "../../../common/hooks";
import { SeverityColorEnum } from "../../../common/enums";
import { LoadingIndicator } from "../../../components";
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const Carousel = (props: {
  images: { url: string; file_name: string }[] | undefined;
}) => {
  const { images } = props;
  const { storeFrontId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleChooseImage = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClickLeft = () => {
    if (selectedIndex > 0) setSelectedIndex((prevState) => prevState - 1);
  };
  const handleClickRight = () => {
    if (images && selectedIndex < images.length - 1)
      setSelectedIndex((prevState) => prevState + 1);
  };

  useLoadingImage();
  return (
    <div className="flex flex-col w-full md:w-1/2 ">
      <Link
        to={`/${storeFrontId}`}
        className="w-80 mx-auto flex flex-row items-center justify-start mb-4"
      >
        {" "}
        <LeftOutlined /> Back{" "}
      </Link>
      <div className="pulse-loading mx-auto relative ">
        <button
          onClick={handleClickLeft}
          className="absolute rounded-full flex items-center justify-center left-2
         top-1/2 w-8 h-8 text-white backdrop-blur-2xl "
        >
          <LeftOutlined />
        </button>
        <button
          onClick={handleClickRight}
          className="absolute rounded-full flex items-center justify-center right-2
         top-1/2 w-8 h-8 text-white backdrop-blur-2xl "
        >
          <RightOutlined />
        </button>
        <img
          src={images ? images[selectedIndex].url : ""}
          alt="selected-image"
          className="h-96  w-80 object-cover mx-auto loading-image"
        />
      </div>
      <div
        className="flex flex-row items-center justify-around overflow-x-scroll
      mt-3 mx-auto "
      >
        {images?.map(({ url }, index) => (
          <div key={index} className="pulse-loading mr-2">
            <img
              alt={`product-image-${index}`}
              src={url}
              onClick={() => handleChooseImage(index)}
              className="object-cover h-16 w-16  loading-image "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductView = () => {
  const { productID } = useParams();

  const { showToast, supabaseFetcher } = useAppContext();
  const [isInCart, setIsInCart] = useState(false);
  const [currentCart, setCurrentCart] = useState<ShoppingCart>();

  useEffect(() => {
    const storageCart = localStorage.getItem("shoppingCart");
    if (storageCart) {
      const cart: ShoppingCart = JSON.parse(storageCart);
      setCurrentCart(cart);
      const product = cart.products.find(
        (product) => product.id === parseInt(productID as string),
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
    try {
      return await supabaseFetcher(
        supabase.from("products").select().eq("id", productID).single(),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };
  const productQuery = useQuery(["product", productID], fetchProduct);

  const handleAddToCart = async () => {
    if (currentCart) {
      const temp: ShoppingCart = JSON.parse(JSON.stringify(currentCart));
      temp.products.push(productQuery.data as Product);
      temp.totalPrice += productQuery.data?.price as number;
      setCurrentCart(temp);
      setIsInCart(true);
    } else {
      setCurrentCart({
        totalPrice: productQuery.data?.price as number,
        products: [productQuery.data as Product],
      });
      setIsInCart(true);
    }
  };

  const handleRemoveFromCart = async () => {
    if (currentCart) {
      const temp = JSON.parse(JSON.stringify(currentCart));
      temp.products = temp.products.filter(
        (product: Product) => product.id !== parseInt(productID as string),
      );
      if (productQuery.data) {
        temp.totalPrice = temp.totalPrice - productQuery.data?.price;
      }
      setCurrentCart(temp);
      setIsInCart(false);
    }
  };

  if (productQuery.isLoading)
    return (
      <LoadingIndicator
        heightWidthXs={30}
        heightWidthMd={40}
        fillColor="fill-black"
      />
    );

  return (
    <div
      className=" flex flex-col md:flex-row items-start justify-center md:w-10/12 mx-auto
    pt-10"
    >
      <Carousel images={productQuery.data?.product_images} />
      <div className="w-full md:w-1/2 md:my-auto  ">
        <h1 className="text-2xl text-center capitalize ">
          {" "}
          {`${productQuery.data?.name}`}{" "}
        </h1>
        <h2 className="text-xl  text-center mb-5 ">
          {" "}
          {`KSH ${productQuery.data?.price}`}{" "}
        </h2>
        {!isInCart && productQuery.data?.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="btn-primary shadow-xl w-full mb-3 "
          >
            {" "}
            ADD TO CART <ShoppingCartOutlined className="ml-1" />{" "}
          </button>
        ) : null}
        {isInCart && (
          <button
            onClick={handleRemoveFromCart}
            className="bg-error text-white rounded-md py-0.5 w-full shadow-xl  uppercase"
          >
            {" "}
            REMOVE FROM CART <ShoppingCartOutlined className="ml-1" />{" "}
          </button>
        )}

        {productQuery.data?.stock < 1 && (
          <button className=" bg-error text-white rounded-md py-0.5 w-full shadow-xl  uppercase">
            {" "}
            SOLD OUT <CloseOutlined className="ml-1" />{" "}
          </button>
        )}

        <p className="text-center mb-1"> {productQuery.data?.description} </p>

        <p className="flex flex-row items-center justify-between w-1/2 mx-auto ">
          {" "}
          <span className="mr-auto">Size</span>{" "}
          <span className="ml-auto">{`${productQuery.data?.size}`}</span>{" "}
        </p>

        <p className="flex flex-row items-center justify-between w-1/2 mx-auto ">
          {" "}
          <span className="mr-auto">Category</span>{" "}
          <span className="ml-auto">{`${productQuery.data?.category}`}</span>{" "}
        </p>

        <p className="flex flex-row items-center justify-between w-1/2 mx-auto ">
          {" "}
          <span className="mr-auto">Condition</span>{" "}
          <span className="ml-auto">{`${productQuery.data?.condition}`}</span>{" "}
        </p>

        <p className="flex flex-row items-center justify-between w-1/2 mx-auto ">
          {" "}
          <span className="mr-auto">Number of items left</span>{" "}
          <span className="ml-auto">{`${productQuery.data?.stock}`}</span>{" "}
        </p>
      </div>
    </div>
  );
};
