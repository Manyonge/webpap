import {
  FacebookFilled,
  InstagramOutlined,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { Product, ShoppingCart } from "../../../common/interfaces";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

const ProductCard = (props: { product: Product }) => {
  const { product } = props;
  const [isInCart, setIsInCart] = useState(false);
  const [currentCart, setCurrentCart] = useState<ShoppingCart>();

  useEffect(() => {
    const storageCart = localStorage.getItem("shoppingCart");
    if (storageCart) {
      const cart: ShoppingCart = JSON.parse(storageCart);
      setCurrentCart(cart);
      const foundProduct = cart.products.find(
        (item) => item.id === parseInt(product.id as string),
      );
      if (foundProduct) {
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

  const handleAddToCart = async (product: Product) => {
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

  const handleRemoveFromCart = async (product: Product) => {
    if (currentCart) {
      const temp = JSON.parse(JSON.stringify(currentCart));
      temp.products = temp.products.filter(
        (item: Product) => item.id !== parseInt(product.id as string),
      );
      temp.totalPrice = temp.totalPrice - product?.price;
      setCurrentCart(temp);
      setIsInCart(false);
    }
  };

  return (
    <div className="rounded-md shadow-lg hover:shadow-xl mx-auto ">
      <Link to={`product/${product.id}`}>
        <img
          src={product.productImages[0].url}
          className="object-cover w-64 h-52 rounded-tr-lg rounded-tl-lg"
        />
      </Link>
      <p className="pl-2 mt-1 text-sm sm:text-lg "> {product.name} </p>

      <div className="flex flex-row items-center justify-between px-2 ">
        <p className="text-sm sm:text-lg"> {product.price} </p>
        <p className="text-sm sm:text-lg"> {product.size} </p>
      </div>
      <div className="flex flex-row items-center justify-center">
        {parseInt(product.stock as string) < 1 && !isInCart ? (
          <button
            className=" mx-auto rounded-full py-1 px-3
        bg-error text-white text-sm mb-2 "
          >
            SOLD OUT
          </button>
        ) : null}

        {parseInt(product.stock as string) > 0 && !isInCart ? (
          <button
            onClick={() => handleAddToCart(product)}
            className=" mx-auto rounded-full py-1 px-3
        bg-primary text-white text-sm mb-2 shadow-lg hover:shadow-xl "
          >
            ADD TO BAG
          </button>
        ) : null}

        {isInCart && (
          <button
            className=" ml-auto rounded-full py-1 px-3
        bg-error text-white text-sm mb-2 "
            onClick={() => handleRemoveFromCart(product)}
          >
            Remove from cart
          </button>
        )}
      </div>
    </div>
  );
};

export const StoreFrontHome = () => {
  const { storeFrontID } = useParams();

  const { showToast } = useAppContext();

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("product categories").select();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const fetchSizes = async () => {
    const { data, error } = await supabase.from("product sizes").select();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const productsQuery = useQuery(["products"], fetchProducts);
  const categoriesQuery = useQuery(["categories"], fetchCategories);
  const sizesQuery = useQuery(["sizes"], fetchSizes);

  return (
    <div className="px-4 md:px-6 pb-44">
      <div className="mt-10 flex flex-row items-center justify-between ">
        <div className="  flex-col items-center justify-center mr-4  ">
          <img
            className="rounded-full h-24 md:h-36 w-24 md:w-36
            border-[grey] mr-auto md:mb-4 "
            src="https://firebasestorage.googleapis.com/v0/b/hustle-build.appspot.com/o/hustles%2Fxlei7bkgxu8o7oirt41k546w8est3i95.png?alt=media&token=a580c71c-7a4d-4325-a08a-37e8e4663c62"
          />
          <p className="text-left font-bold text-lg "> {storeFrontID} </p>
        </div>

        <div>
          <InstagramOutlined className="mr-4" />
          <TwitterCircleFilled className="mr-4" />
          <FacebookFilled className="mr-4" />
        </div>
      </div>

      <p className=""> seller-s bio </p>

      <div className="flex flex-row items-center justify-center my-5">
        <select className="mr-4 outline-none border border-primary rounded-full pl-1 ">
          <option className="hidden">size</option>
          {sizesQuery.data !== undefined && sizesQuery.data.length > 0
            ? sizesQuery.data.map(({ size }, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))
            : null}
        </select>

        <select className="mr-4 outline-none border border-primary rounded-full pl-1 ">
          <option className="hidden">Category</option>
          {categoriesQuery.data !== undefined && categoriesQuery.data.length > 0
            ? categoriesQuery.data.map(({ category }, index) => (
                <option key={index} value={category}>
                  {" "}
                  {category}{" "}
                </option>
              ))
            : null}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-7">
        {productsQuery?.data !== undefined && productsQuery.data.length > 0
          ? productsQuery.data.map((product) => {
              if (product.productImages.length > 0)
                return <ProductCard product={product} key={product.id} />;
            })
          : null}
      </div>
    </div>
  );
};
