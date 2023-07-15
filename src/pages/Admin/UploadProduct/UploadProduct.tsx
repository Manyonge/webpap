import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "../../../common/interfaces";
import { uploadPhoto } from "../../../services";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRetailer } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery, useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";

export const UploadProduct = () => {
  const { storeFrontID } = useParams();
  const { retailer } = useGetRetailer();
  const { register, watch } = useForm<Product>();
  const [message, setMessage] = useState("Upload Product");
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [chosenImages, setChosenImages] = useState<File[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPurpose, setDialogPurpose] = useState<
    "" | "category" | "size" | "condition"
  >("");

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("product categories")
      .select()
      .eq("storeFrontId", storeFrontID);
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
  };
  const fetchConditions = async () => {
    const { data, error } = await supabase
      .from("product conditions")
      .select()
      .eq("storeFrontId", storeFrontID);
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
  };

  const fetchSizes = async () => {
    const { data, error } = await supabase
      .from("product sizes")
      .select()
      .eq("storeFrontId", storeFrontID);
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
  };

  const queryClient = useQueryClient();
  const categoryQuery = useQuery(["category"], fetchCategories, {
    enabled: retailer !== undefined,
  });
  const sizeQuery = useQuery(["size"], fetchSizes, {
    enabled: retailer !== undefined,
  });
  const conditionQuery = useQuery(["condition"], fetchConditions, {
    enabled: retailer !== undefined,
  });

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
    setDialogPurpose("");
  };

  const handleAddCategory = async () => {
    setDialogOpen(true);
    setDialogPurpose("category");
  };

  const handleAddSize = async () => {
    setDialogOpen(true);
    setDialogPurpose("size");
  };

  const handleAddCondition = async () => {
    setDialogOpen(true);
    setDialogPurpose("condition");
  };

  const uploadData = async (tableName: string, data: any) => {
    const { error } = await supabase.from(tableName).insert([data]);
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    showToast(`${dialogPurpose} added successfully`, SeverityColorEnum.Success);
    setDialogOpen(false);
    await queryClient.invalidateQueries(dialogPurpose);
  };

  const handleFileChange = (e: any) => {
    if (chosenImages.length < 5) {
      setChosenImages((prevState) => [...prevState, e.target.files[0]]);
    }
  };

  const handleDeleteFile = (image: any) => {
    const remainingImages = chosenImages.filter((photo) => photo !== image);
    setChosenImages(remainingImages);
  };
  const handleDialogSubmit = async (e: any) => {
    e.preventDefault();
    const inputElement: HTMLInputElement | null = document.querySelector(
      `input[name="popoverPurpose"]`,
    );
    switch (dialogPurpose) {
      case "category":
        await uploadData("product categories", {
          storeFrontId: storeFrontID,
          retailerId: retailer?.id,
          category: inputElement?.value,
        });
        break;
      case "condition":
        await uploadData("product conditions", {
          storeFrontId: storeFrontID,
          retailerId: retailer?.id,
          condition: inputElement?.value,
        });
        break;
      case "size":
        await uploadData("product sizes", {
          storeFrontId: storeFrontID,
          retailerId: retailer?.id,
          size: inputElement?.value,
        });
        break;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = watch();
    if (chosenImages.length === 0) {
      showToast("You have not selected any images", SeverityColorEnum.Error);
      return;
    }

    if (
      formData.category === "" ||
      formData.stock === "" ||
      formData.price === "" ||
      formData.description === "" ||
      formData.condition === "" ||
      formData.size === "" ||
      formData.name === ""
    ) {
      showToast("Please fill in all details", SeverityColorEnum.Error);
      return;
    }

    setMessage("Uploading photos...");

    const uploadedImages = [];

    for (const i in chosenImages) {
      const uniqueId = uuidv4();
      const publicUrl = await uploadPhoto(
        chosenImages[i],
        `product images/${uniqueId}-product-photo.jpg`,
      );
      uploadedImages.push({
        url: publicUrl,
        fileName: `product images/${uniqueId}-product-photo.jpg`,
      });
    }
    formData.productImages = uploadedImages;
    formData.isHidden = false;
    formData.price = parseInt(formData.price as string);
    formData.stock = parseInt(formData.stock as string);
    formData.retailerId = retailer?.id as string;
    formData.storeFrontId = storeFrontID as string;

    setMessage("Uploading product...");
    const { error } = await supabase.from("products").insert([formData]);
    if (error === null) {
      setMessage("Done");
      showToast("Product uploaded successfully", SeverityColorEnum.Success);
      navigate(`/${storeFrontID}/admin/products`);
    }
  };

  return (
    <div className="px-4 py-10">
      <p className="text-center text-lg font-bold">Upload a product</p>

      <form onSubmit={handleSubmit}>
        <div
          className="flex flex-row items-center
         overflow-x-auto  overflow-y-hidden my-6"
        >
          {chosenImages.length < 5 && (
            <div
              className=" rounded-md border-2
            border-dashed border-[grey]
       bg-[lightGrey] flex flex-row
        items-center justify-center mr-4  "
            >
              <label
                className="w-32 h-32  flex flex-row items-center justify-center "
                htmlFor="image-input"
              >
                <PlusOutlined />
              </label>
              <input
                type="file"
                id="image-input"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {chosenImages.length > 0 &&
            chosenImages.map((image, index) => (
              <div
                key={index}
                className="mr-1  flex flex-shrink-0  items-center
              justify-between relative  w-36 h-36"
              >
                <img
                  className=" w-32 h-32  object-cover "
                  src={URL.createObjectURL(image)}
                />

                <button
                  onClick={() => handleDeleteFile(image)}
                  type={"button"}
                  className="absolute top-0 right-0  bg-white
        shadow-lg  rounded-full p-1
         flex flex-col items-start justify-center
         "
                >
                  <DeleteOutlined />
                </button>
              </div>
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
            {categoryQuery.data !== undefined && categoryQuery.data?.length > 0
              ? categoryQuery.data.map(({ category, id }) => (
                  <option value={category} key={id}>
                    {" "}
                    {category}{" "}
                  </option>
                ))
              : null}
          </select>

          <button
            onClick={() => handleAddCategory()}
            type="button"
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
            {sizeQuery.data !== undefined && sizeQuery.data?.length > 0
              ? sizeQuery.data.map(({ size, id }) => (
                  <option value={size} key={id}>
                    {" "}
                    {size}{" "}
                  </option>
                ))
              : null}
          </select>

          <button
            onClick={handleAddSize}
            type="button"
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
            {conditionQuery.data !== undefined &&
            conditionQuery.data?.length > 0
              ? conditionQuery.data.map(({ condition, id }) => (
                  <option value={condition} key={id}>
                    {" "}
                    {condition}{" "}
                  </option>
                ))
              : null}
          </select>

          <button
            onClick={handleAddCondition}
            type="button"
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

      <Dialog.Root open={dialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            onClick={handleDialog}
            className="DialogOverlay opacity-30
            fixed inset-0 bg-black "
          />
          <Dialog.Content
            className="DialogContent bg-white rounded-lg shadow-lg
           fixed top-1/2 left-1/2 focus:outline-none
            py-4 px-7
            "
          >
            <Dialog.Title className="text-center text-lg mb-3">
              {" "}
              {`Add new ${dialogPurpose}`}{" "}
            </Dialog.Title>
            <form
              onSubmit={handleDialogSubmit}
              className="
            flex flex-col items-center justify-center "
            >
              <input
                className="border-2 outline-primary border-primary
                rounded-lg pl-2"
                name="popoverPurpose"
              />
              <br />
              <button
                className="bg-primary text-white px-3 py-1 flex
               flex-row items-center justify-center rounded-lg w-full"
                type="submit"
              >
                {" "}
                <PlusOutlined /> Add{" "}
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
