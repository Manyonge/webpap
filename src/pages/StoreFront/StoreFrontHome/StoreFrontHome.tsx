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
import { useGetRetailer, useLoadingImage } from "../../../common/hooks";

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

  useLoadingImage();
  if (product.is_hidden) return <></>;

  return (
    <div className="w-fit relative ">
      {product.stock < 1 && !isInCart ? (
        <button className="text-sm bg-error text-white absolute ">
          SOLD OUT
        </button>
      ) : null}
      <Link to={`product/${product.id}`}>
        <div className="pulse-loading">
          <img
            loading="lazy"
            alt={`${product.name} image 1`}
            src={product.product_images[0].url}
            className="
            loading-image opacity-0 object-cover w-52 sm:w-56 md:w-64 h-48 sm:h-60 md:h-64"
          />
        </div>
      </Link>
      <p className=" my-auto text-sm text-left uppercase truncate overflow-hidden whitespace-no-wrap">
        {" "}
        {product.name}{" "}
      </p>

      <p className="text-sm text-left uppercase  ">
        {" "}
        {`Size: ${product.size}`}{" "}
      </p>
      <p className="text-sm  text-left uppercase ">
        {" "}
        {`KSH ${product.price}`}{" "}
      </p>

      {product.stock > 0 && !isInCart ? (
        <button
          onClick={() => handleAddToCart(product)}
          className="btn-primary w-full shadow-xl mx-auto text-sm mb-2 uppercase"
        >
          Add to cart
        </button>
      ) : null}

      {isInCart && (
        <button
          className="bg-error text-white rounded-md py-0.5 w-full shadow-xl mx-auto text-sm mb-2 uppercase"
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
            .eq("category", category)
            .order("created_at", { ascending: false }),
        );
      }

      if (size !== "" && category === "") {
        return await supabaseFetcher(
          supabase
            .from("products")
            .select()
            .eq("storefront_id", storeFrontId)
            .eq("size", size)
            .order("created_at", { ascending: false }),
        );
      }

      if (size === "" && category !== "") {
        return await supabaseFetcher(
          supabase
            .from("products")
            .select()
            .eq("storefront_id", storeFrontId)
            .eq("category", category)
            .order("created_at", { ascending: false }),
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
  useLoadingImage();
  return (
    <div className="px-4 md:px-6 py-7">
      <div className="pulse-loading rounded-full mx-auto md:mb-4">
        <img
          loading="lazy"
          alt={`${storeFrontId}-business-logo`}
          className="loading-image opacity-0 rounded-full h-24 md:h-36 w-24 md:w-36
               "
          src={retailer?.business_logo as string}
        />
      </div>

      <div className="flex flex-row items-center justify-center my-5">
        <select className="w-fit mr-1 " onChange={handleSizeChange}>
          <option value="">All sizes</option>
          {sizesQuery.data !== undefined && sizesQuery.data.length > 0
            ? sizesQuery.data.map(({ size }, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))
            : null}
        </select>

        <select className="w-fit ml-1" onChange={handleCategoryChange}>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7 mx-auto  w-fit">
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
