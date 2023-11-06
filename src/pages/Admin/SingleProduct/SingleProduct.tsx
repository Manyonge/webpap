import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "../../../common/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetRetailer, useLoadingImage } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { uploadPhoto } from "../../../services";
import { v4 as uuidv4 } from "uuid";

export const SingleProduct = () => {
  const { storeFrontId, productId } = useParams();
  useLoadingImage();
  const { retailer } = useGetRetailer();
  const { register, watch, setValue } = useForm<Product>();
  const [message, setMessage] = useState("Upload Product");
  const navigate = useNavigate();
  const { showToast, supabaseFetcher } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPurpose, setDialogPurpose] = useState<
    "" | "category" | "size" | "condition"
  >("");

  const fetchPhotos = async () => {
    return await supabaseFetcher(
      supabase
        .from("products")
        .select("product_images")
        .eq("id", productId)
        .single(),
    );
  };

  const fetchProduct = async () => {
    const data = await supabaseFetcher(
      supabase.from("products").select().eq("id", productId).single(),
    );

    setValue("name", data?.name as string);
    setValue("category", data?.category as string);
    setValue("size", data?.size as string);
    setValue("condition", data?.condition as string);
    setValue("description", data?.description as string);
    setValue("stock", data?.stock as string);
    setValue("price", data?.price as number);

    return data;
  };

  const fetchCategories = async () => {
    return supabaseFetcher(
      supabase
        .from("product categories")
        .select()
        .eq("storeFront_id", storeFrontId),
    );
  };
  const fetchConditions = async () => {
    return await supabaseFetcher(
      supabase
        .from("product conditions")
        .select()
        .eq("storeFront_id", storeFrontId),
    );
  };

  const fetchSizes = async () => {
    return await supabaseFetcher(
      supabase.from("product sizes").select().eq("storeFront_id", storeFrontId),
    );
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
  const productQuery = useQuery(["product"], fetchProduct);

  const photosQuery: UseQueryResult<
    { productImages: { url: string; file_name: string }[] },
    PostgrestError
  > = useQuery(["photos"], fetchPhotos);

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
    await supabaseFetcher(supabase.from(tableName).insert([data]));
    showToast(`${dialogPurpose} added successfully`, SeverityColorEnum.Success);
    setDialogOpen(false);
    await queryClient.invalidateQueries(dialogPurpose);
  };

  const handleDialogSubmit = async (e: any) => {
    e.preventDefault();
    const inputElement: HTMLInputElement | null = document.querySelector(
      `input[name="popoverPurpose"]`,
    );
    switch (dialogPurpose) {
      case "category":
        await uploadData("product categories", {
          storefront_id: storeFrontId,
          retailer_id: retailer?.id,
          category: inputElement?.value,
        });
        break;
      case "condition":
        await uploadData("product conditions", {
          storefront_id: storeFrontId,
          retailer_id: retailer?.id,
          condition: inputElement?.value,
        });
        break;
      case "size":
        await uploadData("product sizes", {
          storefront_id: storeFrontId,
          retailer_id: retailer?.id,
          size: inputElement?.value,
        });
        break;
    }
  };

  const handleFileChange = async (e: any) => {
    const uniqueId = uuidv4();
    const publicUrl = await uploadPhoto(
      e.target.files[0],
      `product images/${uniqueId}-product-photo.jpg`,
    );
    const images = photosQuery.data?.productImages;
    images?.push({
      url: publicUrl,
      file_name: `product images/${uniqueId}-product-photo.jpg`,
    });

    await supabaseFetcher(
      supabase
        .from("products")
        .update({ product_images: images })
        .eq("id", productId),
    );

    await queryClient.invalidateQueries("photos");
  };
  const handleDeleteFile = async (fileName: string) => {
    const newPhotos = photosQuery.data?.productImages.filter(
      (image) => image.file_name !== fileName,
    );
    await supabaseFetcher(
      supabase
        .from("products")
        .update({ product_images: newPhotos })
        .eq("id", productId),
    );

    await supabaseFetcher(
      supabase.storage
        .from("webpap storage")
        .remove([`product images/${fileName}`]),
    );

    await queryClient.invalidateQueries("photos");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = watch();
    if (photosQuery.data?.productImages.length === 0) {
      showToast("You have not selected any images", SeverityColorEnum.Error);
      return;
    }

    if (
      formData.category === "" ||
      formData.stock === "" ||
      formData.price.toString() === "" ||
      formData.description === "" ||
      formData.condition === "" ||
      formData.size === "" ||
      formData.name === ""
    ) {
      showToast("Please fill in all details", SeverityColorEnum.Error);
      return;
    }

    formData.is_hidden = productQuery?.data?.is_hidden as boolean;
    formData.price = parseInt(formData.price.toString());
    formData.stock = parseInt(formData.stock as string);
    formData.retailer_id = retailer?.id as string;
    formData.storefront_id = storeFrontId as string;

    setMessage("Uploading product...");
    await supabaseFetcher(
      supabase.from("products").update(formData).eq("id", productId),
    );
    navigate(`/${storeFrontId}/admin/products`);
  };

  return (
    <div className="px-4 md:px-20 py-10">
      <Link
        to={`/${storeFrontId}/admin/products`}
        className="flex flex-row items-center justify-start font-bold "
      >
        {" "}
        <LeftOutlined /> Cancel{" "}
      </Link>
      <p className="text-center text-lg font-bold">Edit this product</p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center overflow-x-auto  overflow-y-hidden my-6">
          {photosQuery.data !== undefined &&
          photosQuery.data?.productImages?.length < 5 ? (
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
          ) : null}

          {photosQuery.data !== undefined &&
          photosQuery?.data?.productImages?.length > 0
            ? photosQuery.data?.productImages?.map((image, index) => (
                <div
                  key={index}
                  className="mr-1  flex flex-shrink-0  items-center
              justify-between relative  w-36 h-36 pulse-loading "
                >
                  <img
                    className=" w-32 h-32  object-cover opacity-0 "
                    alt={`product-image-${index++}`}
                    src={image.url}
                  />

                  <button
                    onClick={() => handleDeleteFile(image.file_name)}
                    type={"button"}
                    className="absolute top-0 right-0  bg-white
        shadow-lg  rounded-full p-1 
         flex flex-col items-start justify-center
         "
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))
            : null}
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
              ? categoryQuery.data.map(
                  ({ category, id }: { category: string; id: number }) => (
                    <option value={category} key={id}>
                      {" "}
                      {category}{" "}
                    </option>
                  ),
                )
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
              ? sizeQuery.data.map(
                  ({ size, id }: { size: string; id: number }) => (
                    <option value={size} key={id}>
                      {" "}
                      {size}{" "}
                    </option>
                  ),
                )
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
              ? conditionQuery.data.map(
                  ({ condition, id }: { condition: string; id: number }) => (
                    <option value={condition} key={id}>
                      {" "}
                      {condition}{" "}
                    </option>
                  ),
                )
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
