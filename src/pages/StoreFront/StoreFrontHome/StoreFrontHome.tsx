import { InstagramOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import {
  Category,
  Product,
  ShoppingCart,
  Size,
} from "../../../common/interfaces";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { SeverityColorEnum } from "../../../common/enums";
import { useGetRetailer } from "../../../common/hooks";

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

  if (product.is_hidden) return <></>;

  return (
    <div
      className="rounded-md shadow-lg hover:shadow-xl mx-auto flex flex-col justify-between
     pb-2  "
    >
      <Link to={`product/${product.id}`}>
        <img
          src={product.product_images[0].url}
          className="object-cover w-52 sm:w-56 md:w-64 h-40 sm:h-52 md:h-56 rounded-tr-lg rounded-tl-lg"
        />
      </Link>
      <p className="pl-2 my-auto text-sm md:text-lg text-center font-bold ">
        {" "}
        {product.name}{" "}
      </p>

      <div className="flex flex-row items-center justify-between px-2 my-auto ">
        <p className="text-sm  text-center md:text-lg">
          {" "}
          {`${product.price} KSH`}{" "}
        </p>
        <p className="text-sm text-center md:text-lg"> {product.size} </p>
      </div>
      {product.stock < 1 && !isInCart ? (
        <button
          className="block mx-auto rounded-full py-1 px-3
        bg-error text-white text-sm  "
        >
          SOLD OUT
        </button>
      ) : null}

      {product.stock > 0 && !isInCart ? (
        <button
          onClick={() => handleAddToCart(product)}
          className="block mx-auto rounded-full py-1 px-3
        bg-primary text-white text-sm shadow-lg hover:shadow-xl mt-auto"
        >
          ADD TO BAG
        </button>
      ) : null}

      {isInCart && (
        <button
          className="block mx-auto rounded-full py-1 px-3
        bg-error text-white text-sm  "
          onClick={() => handleRemoveFromCart(product)}
        >
          Remove from cart
        </button>
      )}
    </div>
  );
};

export const StoreFrontHome = () => {
  const { storeFrontId } = useParams();

  const { showToast, supabaseFetcher } = useAppContext();

  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      return await supabaseFetcher(
        supabase
          .from("product categories")
          .select()
          .eq("storefront_id", storeFrontId),
      );
    } catch (e: any) {
      showToast(e.message);
      throw e;
    }
  };

  const fetchSizes = async (): Promise<Size[]> => {
    try {
      return await supabaseFetcher(
        supabase
          .from("product sizes")
          .select()
          .eq("storefront_id", storeFrontId),
      );
    } catch (e: any) {
      showToast(e.message);
      throw new Error(e.message);
    }
  };

  const fetchProducts = async (): Promise<Product[] | undefined> => {
    try {
      if (size !== "" && category !== "") {
        return await supabaseFetcher(
          supabase
            .from("products")
            .select()
            .eq("storefront_id", storeFrontId)
            .eq("size", size)
            .eq("category", category),
        );
      }

      if (size !== "" && category === "") {
        return await supabaseFetcher(
          supabase
            .from("products")
            .select()
            .eq("storefront_id", storeFrontId)
            .eq("size", size),
        );
      }

      if (size === "" && category !== "") {
        return await supabaseFetcher(
          supabase
            .from("products")
            .select()
            .eq("storefront_id", storeFrontId)
            .eq("category", category),
        );
      }

      if (size === "" && category === "") {
        return await supabaseFetcher(
          supabase.from("products").select().eq("storefront_id", storeFrontId),
        );
      }
      return;
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const productsQuery = useQuery(["products", size, category], fetchProducts);
  const categoriesQuery = useQuery(["categories"], fetchCategories);
  const sizesQuery = useQuery(["sizes"], fetchSizes);
  const { retailer } = useGetRetailer();
  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };
  const handleSizeChange = (e: any) => {
    setSize(e.target.value);
  };

  return (
    <div className="px-4 md:px-6 pb-10">
      <div className="mt-10 flex flex-row items-center justify-between ">
        <div className="  flex-col items-center justify-center mr-4  ">
          <img
            className="rounded-full h-24 md:h-36 w-24 md:w-36
            border-[grey] mr-auto md:mb-4 "
            src={retailer?.business_logo as string}
          />
          <p className="text-left font-bold text-lg "> {storeFrontId} </p>
        </div>

        <div>
          <a
            href={`https://www.instagram.com/${retailer?.instagram_handle}`}
            target="_blank"
          >
            <InstagramOutlined className="mr-4" />
          </a>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center my-5">
        <select
          className="mr-4 outline-none border border-primary
           text-center bg-white rounded-full  "
          onChange={handleSizeChange}
        >
          <option value="">All sizes</option>
          {sizesQuery.data !== undefined && sizesQuery.data.length > 0
            ? sizesQuery.data.map(({ size }, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))
            : null}
        </select>

        <select
          className="mr-4 outline-none border border-primary
           text-center bg-white rounded-full  "
          onChange={handleCategoryChange}
        >
          <option value="">All categories </option>

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

      {productsQuery?.data !== undefined && productsQuery.data.length === 0 ? (
        <p className="text-center font-bold text-lg  mt-10">
          {" "}
          No products available...{" "}
        </p>
      ) : null}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-7">
        {productsQuery?.data !== undefined && productsQuery.data.length > 0
          ? productsQuery.data.map((product) => {
              if (product.product_images.length > 0)
                return <ProductCard product={product} key={product.id} />;
            })
          : null}
      </div>
    </div>
  );
};
