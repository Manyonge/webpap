import * as Tabs from "@radix-ui/react-tabs";
import { LinkOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Product } from "../../../common/interfaces";
import { Link } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";

const ProductPaper = (props: { product: Product }) => {
  const { product } = props;
  const [hiddenChecked, setHiddenChecked] = useState(product.isHidden);
  const handleCheckHidden = () => {
    product.isHidden = !hiddenChecked;
    setHiddenChecked(!hiddenChecked);
  };

  return (
    <div
      className={`px-4 py-4 rounded-lg shadow-lg my-5 ${
        product.isHidden ? "border-2 border-warning" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between mb-4 ">
        <p
          className={`${
            product.stock < 1 ? "text-error" : "text-[#428541]"
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
            ${product.isHidden ? "bg-warning grayscale-0  " : "bg-[lightGrey]"}
            `}
          >
            <Switch.Thumb
              onClick={handleCheckHidden}
              className={`block h-4 w-4 bg-[#fff] rounded-full shadow-lg
              transition-transform duration-100 
              ${product.isHidden ? "translate-x-3/4  " : "translate-x-0"}
              `}
            />
          </Switch.Root>
        </div>
      </div>

      <Link
        to={`${product.productId}`}
        className="flex flex-row items-center justify-between mb-4 "
      >
        <img
          src={product.productImage}
          className="h-16 w-16 rounded-md object-cover "
        />

        <p className="font-bold text-center text-sm"> {product.name} </p>
        <p className="font-bold text-center text-sm"> {product.price} </p>

        <RightOutlined />
      </Link>

      <div className="mx-auto mt-2 flex flex-row items-center justify-center w-max ">
        <button className=" mr-4 rounded-full shadow-lg border-[grey] border text-[grey] text-sm px-2 py-0.5">
          <LinkOutlined /> Copy link
        </button>
        <button className=" ml-4 rounded-full shadow-lg border-error border text-error text-sm px-2 py-0.5">
          {" "}
          Delete
        </button>
      </div>
    </div>
  );
};

export const UploadedProducts = () => {
  const [selectedTab, setSelectedTab] = useState("allProducts");
  const [allProducts, setAllProducts] = useState([
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 1,
      isHidden: false,
      productId: "iufiduf",
    },
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 0,
      isHidden: true,
      productId: "ifidu",
    },
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 1,
      isHidden: false,
      productId: "dufi",
    },
  ]);
  const [soldProducts, setSoldProducts] = useState([
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 0,
      isHidden: false,
      productId: "fi",
    },
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 0,
      isHidden: false,
      productId: "iufidu",
    },
  ]);

  const tabs = [
    {
      label: "All",
      value: "allProducts",
      products: allProducts,
    },
    {
      label: "Sold out",
      value: "soldProducts",
      products: soldProducts,
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
        <Tabs.List
          className="border-b shrink-0 mb-4 flex"
          defaultValue="allProducts"
        >
          {tabs.map(({ label, value }) => (
            <Tabs.Trigger
              key={value}
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

        {tabs.map(({ value, products }) => (
          <Tabs.Content key={value} className="w-full focus: " value={value}>
            {products.map((product) => (
              <ProductPaper key={value} product={product} />
            ))}
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <Link to={"upload"}>
        <button
          onClick={handleScrollToTop}
          className="  bg-primary rounded-full shadow-2xl fixed bottom-32 px-3 py-3 text-[#fff] flex flex-row items-center justify-center  right-10"
        >
          <PlusOutlined />
        </button>
      </Link>
    </div>
  );
};
