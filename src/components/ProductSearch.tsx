import { useState } from "react";
import { useAppContext } from "../contexts";
import { Product } from "../common/interfaces";
import { supabase } from "../supabase.ts";
import { SeverityColorEnum } from "../common/enums";
import { useQuery } from "react-query";
import { useLoadingImage } from "../common/hooks";
import { LoadingIndicator } from "./LoadingIndicator.tsx";
import { Link } from "react-router-dom";

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

  const handleLinkClick = () => {
    dialog?.close();
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
        className="pl-2"
      />
      {searchString !== "" && (
        <dialog
          open={searchString.length > 0}
          className="w-full rounded-lg shadow-2xl "
        >
          {searchQuery.isLoading && (
            <LoadingIndicator
              heightWidthXs={20}
              heightWidthMd={30}
              fillColor="fill-black"
            />
          )}
          {searchQuery.data && searchQuery.data.length === 0 ? (
            <p className="text-error text-center py-2">No products found...</p>
          ) : null}
          {searchQuery.data && searchQuery.data.length > 0
            ? searchQuery.data.map(
                ({ name, id, product_images, size, stock }) => (
                  <Link
                    key={id}
                    to={`${resultRoute}${id}`}
                    className="flex flex-row items-center justify-start
                    px-2 py-1"
                    onClick={handleLinkClick}
                  >
                    <div className="pulse-loading rounded-md ">
                      <img
                        loading="lazy"
                        alt={`${name}-image-1`}
                        src={product_images[0].url}
                        className=" rounded-md loading-image object-cover h-14 w-14 "
                      />
                    </div>
                    <p className="mx-auto lowercase text-xs md:text-base text-center ">
                      {" "}
                      <span> {name} </span>
                      <span> {size} </span>
                      {stock < 1 && (
                        <span className="text-error"> Sold out </span>
                      )}
                      {stock > 0 && (
                        <span className="text-success"> In stock </span>
                      )}
                    </p>
                  </Link>
                ),
              )
            : null}
        </dialog>
      )}
    </div>
  );
};
