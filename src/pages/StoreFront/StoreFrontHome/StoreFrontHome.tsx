import {
  FacebookFilled,
  InstagramOutlined,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Product } from "../../../common";

const ProductCard = (props: { product: Product }) => {
  const { product } = props;
  return (
    <div className="rounded-md shadow-lg hover:shadow-xl mx-auto ">
      <Link to={`product/${product.productId}`}>
        <img
          src={product.productImage}
          className="object-cover w-full h-42 rounded-tr-lg rounded-tl-lg"
        />
      </Link>
      <p className="pl-2 mt-1 text-sm sm:text-lg "> {product.name} </p>

      <div className="flex flex-row items-center justify-between px-2 ">
        <p className="text-sm sm:text-lg"> {product.price} </p>
        <p className="text-sm sm:text-lg"> {product.size} </p>
      </div>
      <div className="flex flex-row items-center justify-center">
        {product.stock < 1 && (
          <button
            className=" mx-auto rounded-full py-1 px-3
        bg-error text-white text-sm mb-2 "
          >
            SOLD OUT
          </button>
        )}

        {product.stock > 0 && (
          <button
            className=" mx-auto rounded-full py-1 px-3
        bg-primary text-white text-sm mb-2 shadow-lg hover:shadow-xl "
          >
            ADD TO BAG
          </button>
        )}
      </div>
    </div>
  );
};

export const StoreFrontHome = () => {
  const { storeFrontID } = useParams();
  const [products, setProducts] = useState([
    {
      name: "Jordan 1s",
      productImage:
        "https://hustle.imgix.net/a0ugvj7ynvo1x2hcig88jxiffhvoxti5.jpeg?fit=crop&w=512&h=512",
      price: 2500,
      size: "42 EUR",
      stock: 0,
      isHidden: false,
      productId: "iufiduf",
    },
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
      stock: 1,
      isHidden: false,
      productId: "iufiduf",
    },
  ]);

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
          <option> EUR 42 </option>
          <option> EUR 42 </option>
        </select>

        <select className="mr-4 outline-none border border-primary rounded-full pl-1 ">
          <option className="hidden">Category</option>
          <option> Jordans </option>
          <option> Jordans </option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-7">
        {products.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
    </div>
  );
};
