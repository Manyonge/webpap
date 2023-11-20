import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product, ShoppingCart } from "../../../common/interfaces";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts";
import { useQuery } from "react-query";
import { useLoadingImage } from "../../../common/hooks";
import { SeverityColorEnum } from "../../../common/enums";
import { LoadingIndicator } from "../../../components";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Carousel = (props: {
  images: { url: string; file_name: string }[] | undefined;
}) => {
  const { images } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState(
    images && images.length > 0 ? images[selectedIndex].url : null,
  );

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
    <div className="flex flex-col w-full md:w-1/2 border">
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
          <div key={index} className="pulse-loading">
            <img
              alt={`product-image-${index}`}
              src={url}
              onClick={() => handleChooseImage(index)}
              className="object-cover h-14 w-14 mr-2 loading-image "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductView = () => {
  const { storeFrontId, productID } = useParams();

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
        (product: Product) => product.id !== parseInt(productID as string),
      );
      if (product?.price) {
        temp.totalPrice = temp.totalPrice - product?.price;
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
      className=" flex flex-col md:flex-row items-center justify-center md:w-10/12 mx-auto
    pt-24"
    >
      <Carousel images={productQuery.data?.product_images} />
      <div className="w-full md:w-1/2 border"></div>
    </div>
  );
};
