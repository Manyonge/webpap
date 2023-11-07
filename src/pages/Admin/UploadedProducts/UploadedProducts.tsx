import * as Tabs from "@radix-ui/react-tabs";
import { LinkOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Product } from "../../../common/interfaces";
import { Link, useParams } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";
import { useQuery, useQueryClient } from "react-query";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/";
import { SeverityColorEnum } from "../../../common/enums";
import { useLoadingImage } from "../../../common/hooks";
import { LoadingIndicator } from "../../../components";

const ProductSearch = () => {
  const [searchString, setSearchString] = useState("");

  const { supabaseFetcher, showToast } = useAppContext();
  const dialog = document.querySelector("dialog");

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      return await supabaseFetcher(
        supabase.from("products").select().ilike("name", searchString),
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
    <div className="w-3/4 mx-auto relative mb-2 z-10 ">
      <input
        type="search"
        onChange={handleSearchChange}
        value={searchString}
        placeholder="Search product by name"
        className=" pl-1 border-2 border-primary outline-none rounded-full w-full"
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
                    to={`${id}`}
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

const ProductPaper = (props: { product: Product }) => {
  const { product } = props;
  useLoadingImage();
  const { storeFrontId } = useParams();
  const { showToast, supabaseFetcher } = useAppContext();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [hiddenChecked, setHiddenChecked] = useState(product.is_hidden);
  const queryClient = useQueryClient();
  const handleHideProduct = async () => {
    product.is_hidden = !hiddenChecked;
    setHiddenChecked(!hiddenChecked);
    await supabaseFetcher(
      supabase
        .from("products")
        .update({ is_hidden: !hiddenChecked })
        .eq("id", product.id),
    );
    await queryClient.invalidateQueries("allProducts");
    await queryClient.invalidateQueries("soldProducts");
    await queryClient.invalidateQueries("hiddenProducts");
    await queryClient.invalidateQueries("availableProducts");
  };
  const handleCopyLink = async () => {
    const domain = window.location.hostname;
    await navigator.clipboard.writeText(
      `${domain}/${storeFrontId}/product/${product.id}`,
    );
    showToast("Link copied to clipboard", SeverityColorEnum.Normal);
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleteLoading(true);
      const photos = [];
      for (const i in product.product_images) {
        photos.push(product.product_images[i].file_name);
      }
      await supabaseFetcher(
        supabase.storage.from("webpap storage").remove(photos),
      );

      await supabaseFetcher(
        supabase.from("products").delete().eq("id", product.id),
      );

      await queryClient.invalidateQueries("allProducts");
      await queryClient.invalidateQueries("soldProducts");
      await queryClient.invalidateQueries("hiddenProducts");
      await queryClient.invalidateQueries("availableProducts");

      setDeleteLoading(false);
      showToast("Product deleted successfully", SeverityColorEnum.Success);
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      setDeleteLoading(false);
      throw e;
    }
  };

  return (
    <div
      className={`px-4 py-4 rounded-lg shadow-2xl my-5 ${
        product.is_hidden ? "border-2 border-warning" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between mb-4 ">
        <p
          className={` text-white px-2 py-1 rounded-full ${
            product.stock < 1 ? "bg-error" : "bg-success"
          } text-sm`}
        >
          {" "}
          {`${product.stock < 1 ? "SOLD OUT" : "IN STOCK"}`}{" "}
        </p>

        <div className="flex flex-row items-center justify-between  w-1/3">
          <label htmlFor="hide-switch" className="text-sm mr-2">
            {" "}
            Hidden{" "}
          </label>

          <Switch.Root
            checked={hiddenChecked}
            id={"hide-switch"}
            className={`rounded-full w-9 h-5 px-1 py-3
            flex shrink-0 flex-row items-center 
            relative shadow-lg focus:shadow-xl hover:shadow-xl checked:bg-[#000]
            ${product.is_hidden ? "bg-warning grayscale-0  " : "bg-[lightGrey]"}
            `}
          >
            <Switch.Thumb
              onClick={handleHideProduct}
              className={`block h-4 w-4 bg-[#fff] rounded-full shadow-lg
              transition-transform duration-100 
              ${product.is_hidden ? "translate-x-3/4  " : "translate-x-0"}
              `}
            />
          </Switch.Root>
        </div>
      </div>

      <Link
        to={`${product.id}`}
        className="flex flex-row items-center justify-between mb-4 "
      >
        {product.product_images.length > 0 && (
          <div className="pulse-loading">
            <img
              loading="lazy"
              alt={`${product.name} first image`}
              src={product.product_images[0].url}
              className="h-16 w-16 rounded-md object-cover
             loading-image opacity-0"
            />
          </div>
        )}

        {product.product_images.length === 0 && (
          <p className="text-error text-sm ">No Images added</p>
        )}

        <p className="font-bold text-center text-sm"> {product.name} </p>
        <p className="font-bold text-center text-sm"> {product.size} </p>
        <p className="font-bold text-center text-sm"> {product.price} </p>

        <RightOutlined />
      </Link>

      <div className="mx-auto mt-2 flex flex-row items-center justify-center w-max ">
        <button
          onClick={handleCopyLink}
          className=" mr-4 rounded-full shadow-lg
        border-[grey] border text-[grey] text-sm px-2 py-0.5"
        >
          <LinkOutlined /> Copy link
        </button>
        <button
          disabled={deleteLoading}
          onClick={handleDeleteProduct}
          className=" ml-4 rounded-full shadow-lg border-error border text-error text-sm px-2 py-0.5"
        >
          {deleteLoading && (
            <LoadingIndicator
              heightWidthXs={10}
              heightWidthMd={20}
              fillColor="fill-error"
            />
          )}
          {!deleteLoading && "Delete"}
        </button>
      </div>
    </div>
  );
};
export const UploadedProducts = () => {
  const [selectedTab, setSelectedTab] = useState("allProducts");
  const { storeFrontId } = useParams();
  const { supabaseFetcher } = useAppContext();
  const fetchAllProducts = async () => {
    return await supabaseFetcher(
      supabase
        .from("products")
        .select()
        .eq("storefront_id", storeFrontId)
        .order("created_at", { ascending: false }),
    );
  };

  const fetchAvailableProducts = async () => {
    return await supabaseFetcher(
      supabase
        .from("products")
        .select()
        .eq("storefront_id", storeFrontId)
        .gt("stock", 0)
        .order("created_at", { ascending: false }),
    );
  };

  const fetchSoldProducts = async () => {
    return await supabaseFetcher(
      supabase
        .from("products")
        .select()
        .eq("storefront_id", storeFrontId)
        .eq("stock", 0)
        .order("created_at", { ascending: false }),
    );
  };

  const fetchHiddenProducts = async () => {
    return await supabaseFetcher(
      supabase
        .from("products")
        .select()
        .eq("storefront_id", storeFrontId)
        .eq("is_hidden", true)
        .order("created_at", { ascending: false }),
    );
  };

  const allProductsQuery = useQuery(
    ["allProducts", selectedTab],
    fetchAllProducts,
    { enabled: selectedTab === "allProducts" },
  );

  const availableProductsQuery = useQuery(
    ["availableProducts", selectedTab],
    fetchAvailableProducts,
    { enabled: selectedTab === "availableProducts" },
  );

  const soldProductsQuery = useQuery(
    ["soldProducts", selectedTab],
    fetchSoldProducts,
    { enabled: selectedTab === "soldProducts" },
  );

  const hiddenProductsQuery = useQuery(
    ["hiddenProducts", selectedTab],
    fetchHiddenProducts,
    { enabled: selectedTab === "hiddenProducts" },
  );

  const tabs = [
    {
      label: "All",
      value: "allProducts",
      products: allProductsQuery.data,
    },
    {
      label: "Available",
      value: "availableProducts",
      products: availableProductsQuery.data,
    },
    {
      label: "Sold out",
      value: "soldProducts",
      products: soldProductsQuery.data,
    },
    {
      label: "Hidden",
      value: "hiddenProducts",
      products: hiddenProductsQuery.data,
    },
  ];

  const handleTab = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-4 md:px-40 pt-10 relative ">
      <p className="font-bold text-lg mb-3 md:text-xl text-center ">Products</p>
      <ProductSearch />

      <Tabs.Root
        className=" px-2 md:px-10 mt-5 flex flex-col items-center justify-center  "
        defaultValue="allProducts"
      >
        <Tabs.List className="shrink-0  flex" defaultValue="allProducts">
          {tabs.map(({ label, value }, index) => (
            <Tabs.Trigger
              key={index}
              className={`${
                selectedTab === value
                  ? "font-bold bg-primary text-[#fff] rounded-full"
                  : ""
              } select-none px-4 py-0.5`}
              value={value}
              onClick={() => handleTab(value)}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map(({ value, products }, index) => (
          <Tabs.Content key={index} className="w-full focus: " value={value}>
            {hiddenProductsQuery.isLoading ||
            allProductsQuery.isLoading ||
            soldProductsQuery.isLoading ||
            availableProductsQuery.isLoading ? (
              <LoadingIndicator
                heightWidthXs={30}
                heightWidthMd={40}
                fillColor="fill-black"
                styleClasses="mx-auto mt-32"
              />
            ) : null}

            {products?.length === 0 && (
              <p className="text-center text-error mt-32 ">
                No products available...
              </p>
            )}

            {products?.map((product: Product, index: number) => (
              <ProductPaper key={index} product={product} />
            ))}
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <Link to={"upload"}>
        <button
          onClick={handleScrollToTop}
          className="  bg-primary rounded-full shadow-2xl
           fixed bottom-32
           px-3 py-3 text-[#fff] flex flex-row items-center
            justify-center  right-10"
        >
          <PlusOutlined />
        </button>
      </Link>
    </div>
  );
};
