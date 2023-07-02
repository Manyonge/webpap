import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ImageInput } from "../../../components";

export const UploadProduct = () => {
  const [productImages, setProductImages] = useState([
    {
      url: false,
    },
    {
      url: false,
    },
    {
      url: false,
    },
    {
      url: false,
    },
    {
      url: false,
    },
  ]);

  return (
    <div className="px-4 py-10">
      <p className="text-center text-lg font-bold">Upload a product</p>

      <form className="">
        <div className="flex flex-row items-center overflow-x-auto  overflow-y-hidden my-6">
          {productImages.map((productImage, index) => (
            <ImageInput
              setProductImages={setProductImages}
              url={productImage.url as unknown as Blob}
              index={index}
              key={index}
            />
          ))}
        </div>

        <p className="font-bold text-sm mb-2"> Product details</p>

        <div className="flex flex-row items-center justify-between">
          <select
            id="category"
            placeholder="Category"
            className="border border-primary rounded-md outline-none w-1/2 text-sm "
          >
            <option value="" disabled defaultChecked className="hidden">
              {" "}
              <>
                Category <DownOutlined />{" "}
              </>
            </option>
            <option>Air jordan 1</option>
            <option>Air jordan 1</option>
            <option>Air jordan 1</option>
          </select>

          <button
            className="border border-primary outline-none rounded-md shadow-lg text-sm w-5/12
          flex flex-row items-center justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <input
          placeholder="Enter product name"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        />

        <div className="flex flex-row items-center justify-between mt-4">
          <select
            id="category"
            placeholder="Category"
            className="border border-primary rounded-md outline-none w-1/2 text-sm "
          >
            <option value="" disabled defaultChecked className="hidden">
              <>
                Size <DownOutlined />
              </>
            </option>
            <option>EUR 42</option>
            <option>EUR 42</option>
            <option>EUR 42</option>
          </select>

          <button
            className="border border-primary outline-none rounded-md shadow-lg text-sm w-5/12
          flex flex-row items-center justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <div className="flex flex-row items-center justify-between mt-4">
          <select
            id="category"
            placeholder="Category"
            className="border border-primary rounded-md outline-none w-1/2 text-sm "
          >
            <option value="" disabled defaultChecked className="hidden">
              <>
                Condition <DownOutlined />
              </>
            </option>
            <option>Brand new</option>
            <option>Pre-owned</option>
          </select>

          <button
            className="border border-primary outline-none rounded-md shadow-lg text-sm w-5/12
          flex flex-row items-center justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <input
          type="number"
          placeholder="Units available"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        />
        <p className="text-[grey] text-center text-xs">
          {" "}
          A value of '0' means the product is sold out{" "}
        </p>

        <input
          type="number"
          placeholder="Product price"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        />

        <button
          type="submit"
          className="bg-primary text-white w-full rounded-md mt-10 shadow-lg "
        >
          {" "}
          Upload product{" "}
        </button>
      </form>
    </div>
  );
};
