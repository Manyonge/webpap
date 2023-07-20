import * as Tabs from "@radix-ui/react-tabs";
import { LinkOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Product } from "../../../common/interfaces";
import { Link, useParams } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";
import { useQuery, useQueryClient } from "react-query";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";

const ProductPaper = (props: { product: Product }) => {
  const { product } = props;

  const { storeFrontID } = useParams();
  const { showToast } = useAppContext();

  const [hiddenChecked, setHiddenChecked] = useState(product.isHidden);
  const queryClient = useQueryClient();
  const handleHideProduct = async () => {
    product.isHidden = !hiddenChecked;
    setHiddenChecked(!hiddenChecked);
    const { error } = await supabase
      .from("products")
      .update({ isHidden: !hiddenChecked })
      .eq("id", product.id);
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
  };
  const handleCopyLink = async () => {
    const domain = window.location.hostname;
    await navigator.clipboard.writeText(
      `${domain}/${storeFrontID}/products/${product.id}`,
    );
    showToast("Link copied to clipboard");
  };

  const handleDeleteProduct = async () => {
    const photos = [];
    for (const i in product.productImages) {
      photos.push(product.productImages[i].fileName);
    }
    const { error: storageError } = await supabase.storage
      .from("webpap storage")
      .remove(photos);

    if (storageError) {
      showToast(storageError.message, SeverityColorEnum.Error);
      throw new Error(storageError.message);
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    await queryClient.invalidateQueries("allProducts");
    await queryClient.invalidateQueries("soldProducts");
    await queryClient.invalidateQueries("hiddenProducts");
    showToast("Product deleted successfully", SeverityColorEnum.Success);
  };

  return (
    <div
      className={`px-4 py-4 rounded-lg shadow-lg my-5 ${
        product.isHidden ? "border-2 border-warning" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between mb-4 ">
        <p
          className={` text-white px-2 py-1 rounded-full ${
            parseInt(product.stock as string) < 1 ? "bg-error" : "bg-success"
          } text-sm`}
        >
          {" "}
          {`${
            parseInt(product.stock as string) < 1 ? "SOLD OUT" : "IN STOCK"
          }`}{" "}
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
            ${product.isHidden ? "bg-warning grayscale-0  " : "bg-[lightGrey]"}
            `}
          >
            <Switch.Thumb
              onClick={handleHideProduct}
              className={`block h-4 w-4 bg-[#fff] rounded-full shadow-lg
              transition-transform duration-100 
              ${product.isHidden ? "translate-x-3/4  " : "translate-x-0"}
              `}
            />
          </Switch.Root>
        </div>
      </div>

      <Link
        to={`${product.id}`}
        className="flex flex-row items-center justify-between mb-4 "
      >
        {product.productImages.length > 0 && (
          <img
            src={product.productImages[0].url}
            className="h-16 w-16 rounded-md object-cover "
          />
        )}

        {product.productImages.length === 0 && (
          <p className="text-error text-sm ">No Images added</p>
        )}

        <p className="font-bold text-center text-sm"> {product.name} </p>
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
          onClick={handleDeleteProduct}
          className=" ml-4 rounded-full shadow-lg border-error border text-error text-sm px-2 py-0.5"
        >
          {" "}
          Delete
        </button>
      </div>
    </div>
  );
};
export const UploadedProducts = () => {
  const [selectedTab, setSelectedTab] = useState("allProducts");
  const { storeFrontID } = useParams();
  const { showToast } = useAppContext();
  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("storeFrontId", storeFrontID)
      .order("created_at", { ascending: false });
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
  };

  const fetchSoldProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("storeFrontId", storeFrontID)
      .eq("stock", 0)
      .order("created_at", { ascending: false });

    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }

    return data;
  };

  const fetchHiddenProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("storeFrontId", storeFrontID)
      .eq("isHidden", true)
      .order("created_at", { ascending: false });

    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }

    return data;
  };

  const allProductsQuery = useQuery(
    ["allProducts", selectedTab],
    fetchAllProducts,
    { enabled: selectedTab === "allProducts" },
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
      <p className="font-bold text-lg md:text-xl text-center ">Products</p>

      <Tabs.Root
        className=" px-2 md:px-10 mt-10 flex flex-col items-center justify-center  "
        defaultValue="allProducts"
      >
        <Tabs.List className="shrink-0 mb-4 flex" defaultValue="allProducts">
          {tabs.map(({ label, value }, index) => (
            <Tabs.Trigger
              key={index}
              className={`${
                selectedTab === value
                  ? "font-bold bg-primary text-[#fff] rounded-lg"
                  : ""
              } select-none px-4 py-2`}
              value={value}
              onClick={() => handleTab(value)}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map(({ value, products }, index) => (
          <Tabs.Content key={index} className="w-full focus: " value={value}>
            {products?.map((product, index) => (
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
