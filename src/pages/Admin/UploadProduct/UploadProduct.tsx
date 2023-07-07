import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ImageInput } from "../../../components";
import { useForm } from "react-hook-form";
import { Product } from "../../../common/interfaces";
import { uploadPhoto } from "../../../services";
import { useParams } from "react-router-dom";
import { useGetRetailer } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";

export const UploadProduct = () => {
  const { storeFrontID } = useParams();
  const { retailer } = useGetRetailer();
  const { register, watch } = useForm<Product>();
  const [message, setMessage] = useState("Upload Product");

  const [productImages, setProductImages] = useState<
    { url: string | boolean }[]
  >([
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

  const handleAddCategory = async () => {
    return;
  };

  const handleAddSize = async () => {
    return;
  };

  const handleAddCondition = async () => {
    return;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = watch();

    setMessage("Uploading photos...");

    for (const i in productImages) {
      const publicUrl = await uploadPhoto(
        productImages[i].url,
        `product images/${formData.name}-img-${i + 1}`,
      );
      productImages[i].url = publicUrl;
    }
    formData.productImages = productImages;
    formData.isHidden = false;
    formData.retailerId = retailer?.id as number;
    formData.storeFrontId = storeFrontID as string;

    setMessage("Uploading product...");
    const { data, error } = await supabase.from("products").insert([formData]);
    console.log({ data, error });
  };

  return (
    <div className="px-4 py-10">
      <p className="text-center text-lg font-bold">Upload a product</p>

      <form onSubmit={handleSubmit}>
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
            {...register("category")}
            className="border border-primary rounded-md
             outline-none w-1/2 text-sm "
          >
            <option value="" defaultChecked hidden>
              Category
            </option>
            <option>Air jordan 2</option>
            <option>Air jordan 1</option>
            <option>Air jordan 1</option>
          </select>

          <button
            onClick={handleAddCategory}
            className="border border-primary outline-none
             rounded-md shadow-lg text-sm w-5/12
          flex flex-row items-center justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <input
          placeholder="Enter product name"
          {...register("name")}
          className="border border-primary
           w-full rounded-md mt-5 px-2 "
        />

        <div className="flex flex-row items-center justify-between mt-4">
          <select
            {...register("size")}
            className="border border-primary
            rounded-md outline-none w-1/2 text-sm "
          >
            <option value="" defaultChecked hidden>
              Size
            </option>
            <option>EUR 42</option>
            <option>EUR 42</option>
            <option>EUR 42</option>
          </select>

          <button
            onClick={handleAddSize}
            className="border border-primary
             outline-none rounded-md
              shadow-lg text-sm w-5/12
          flex flex-row items-center justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <div className="flex flex-row items-center justify-between mt-4">
          <select
            {...register("condition")}
            className="border border-primary
            rounded-md outline-none w-1/2 text-sm "
          >
            <option value="" defaultChecked hidden>
              Condition
            </option>
            <option>Brand new</option>
            <option>Pre-owned</option>
          </select>

          <button
            onClick={handleAddCondition}
            className="border border-primary
             outline-none rounded-md
              shadow-lg text-sm w-5/12
          flex flex-row items-center
           justify-center px-2
          "
          >
            {" "}
            New <PlusOutlined />
          </button>
        </div>

        <textarea
          {...register("description")}
          placeholder="Product description"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        ></textarea>

        <input
          type="number"
          {...register("stock")}
          placeholder="Units available"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        />
        <p className="text-[grey] text-center text-xs">
          {" "}
          A value of '0' means the product is sold out{" "}
        </p>

        <input
          type="number"
          {...register("price")}
          placeholder="Product price"
          className="border border-primary w-full rounded-md mt-5 px-2 "
        />

        <button
          type="submit"
          className="bg-primary text-white
           w-full
           rounded-md mt-10 shadow-lg "
        >
          {" "}
          {message}
        </button>
      </form>
    </div>
  );
};
