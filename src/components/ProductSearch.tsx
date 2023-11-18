import { useState } from "react";
import { useAppContext } from "../contexts";
import { Product } from "../common/interfaces";
import { supabase } from "../supabase.ts";
import { SeverityColorEnum } from "../common/enums";
import { useQuery } from "react-query";
import { useLoadingImage } from "../common/hooks";
import { LoadingIndicator } from "./LoadingIndicator.tsx";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

export const ProductSearch = (props: {
  resultRoute: string;
  widthClass?: string;
}) => {
  const { resultRoute, widthClass } = props;
  const [searchString, setSearchString] = useState("");

  const { supabaseFetcher, showToast } = useAppContext();
  const dialog = document.querySelector("dialog");

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      return await supabaseFetcher(
        supabase.from("products").select().ilike("name", `%${searchString}%`),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const searchQuery = useQuery(["searchQuery", searchString], {
    queryFn: fetchProducts,
  });
  const handleSearchChange = (e: any) => {
    setSearchString(e.target.value);
  };

  document.addEventListener("click", (event) => {
    if (!dialog?.contains(event.target as Node) && dialog?.open) {
      setSearchString("");
      dialog?.close();
    }
  });

  useLoadingImage();
  return (
    <div
      className={`${
        widthClass ? widthClass : ""
      } mx-auto relative my-auto z-10 `}
    >
      <input
        type="search"
        onChange={handleSearchChange}
        value={searchString}
        placeholder="Search product by name"
        className=" "
      />
      {searchString !== "" && (
        <dialog
          open={searchString.length > 0}
          className="w-full py-2 shadow-2xl rounded-lg "
        >
          {searchQuery.isLoading && (
            <LoadingIndicator
              heightWidthXs={20}
              heightWidthMd={30}
              fillColor="fill-black"
            />
          )}
          {searchQuery.data && searchQuery.data.length === 0 ? (
            <p className="text-error text-center">No products found...</p>
          ) : null}
          {searchQuery.data && searchQuery.data.length > 0
            ? searchQuery.data.map(
                ({ name, id, product_images, size, stock }) => (
                  <Link
                    key={id}
                    to={`${resultRoute}${id}`}
                    className="flex flex-row items-center justify-evenly my-2"
                  >
                    <div className="pulse-loading rounded-md ">
                      <img
                        loading="lazy"
                        alt={`${name}-image-1`}
                        src={product_images[0].url}
                        className=" rounded-md loading-image object-cover h-14 w-14 "
                      />
                    </div>
                    <p> {name} </p>
                    <p> {size} </p>
                    {stock === 0 && (
                      <p className="text-white rounded-full bg-error text-sm px-2 ">
                        {" "}
                        Sold out{" "}
                      </p>
                    )}
                    {stock > 0 && (
                      <p className="text-white rounded-full bg-success text-sm px-2 ">
                        {" "}
                        In stock{" "}
                      </p>
                    )}
                    <RightOutlined />
                  </Link>
                ),
              )
            : null}
        </dialog>
      )}
    </div>
  );
};
