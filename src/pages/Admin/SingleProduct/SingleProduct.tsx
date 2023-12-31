import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "../../../common/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetRetailer, useLoadingImage } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts";
import { SeverityColorEnum } from "../../../common/enums";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { LoadingIndicator } from "../../../components";
import { v4 as uuidv4 } from "uuid";

export const SingleProduct = () => {
  const { storeFrontId, productId } = useParams();
  const { retailer } = useGetRetailer();
  const { register, watch, setValue } = useForm<Product>();
  const navigate = useNavigate();
  const { showToast, supabaseFetcher, uploadPhoto } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPurpose, setDialogPurpose] = useState<
    "" | "category" | "size" | "condition"
  >("");

  const [productLoading, setProductLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPhotos = async () => {
    try {
      return await supabaseFetcher(
        supabase
          .from("products")
          .select("product_images")
          .eq("id", productId)
          .single(),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const fetchProduct = async () => {
    try {
      const data = await supabaseFetcher(
        supabase.from("products").select().eq("id", productId).single(),
      );

      setValue("name", data?.name as string);
      setValue("category", data?.category as string);
      setValue("size", data?.size as string);
      setValue("condition", data?.condition as string);
      setValue("description", data?.description as string);
      setValue("stock", data?.stock);
      setValue("price", data?.price as number);
      return data;
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const fetchCategories = async () => {
    try {
      return supabaseFetcher(
        supabase
          .from("product categories")
          .select()
          .eq("storefront_id", storeFrontId),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };
  const fetchConditions = async () => {
    try {
      return await supabaseFetcher(
        supabase
          .from("product conditions")
          .select()
          .eq("storefront_id", storeFrontId),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  const fetchSizes = async () => {
    try {
      return await supabaseFetcher(
        supabase
          .from("product sizes")
          .select()
          .eq("storefront_id", storeFrontId),
      );
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
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
    { product_images: { url: string; file_name: string }[] },
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
    try {
      setDataLoading(true);
      await supabaseFetcher(supabase.from(tableName).insert([data]));
      showToast(
        `${dialogPurpose} added successfully`,
        SeverityColorEnum.Success,
      );
      setDataLoading(false);
      setDialogOpen(false);
      await queryClient.invalidateQueries(dialogPurpose);
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
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
    try {
      const uniqueId = uuidv4();
      const publicUrl = await uploadPhoto(
        e.target.files[0],
        `product images/${uniqueId}-product-photo.jpg`,
      );
      const images = photosQuery.data?.product_images;
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
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };
  const handleDeleteFile = async (fileName: string) => {
    try {
      setDeleteLoading(true);

      const newPhotos = photosQuery.data?.product_images.filter(
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
      setDeleteLoading(false);
    } catch (e: any) {
      setDeleteLoading(false);
      showToast(e.message, SeverityColorEnum.Error);

      throw e;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setProductLoading(true);
      const formData = watch();
      if (photosQuery.data?.product_images.length === 0) {
        showToast("You have not selected any images", SeverityColorEnum.Error);
        setProductLoading(false);
        return;
      }

      if (
        formData.category === "" ||
        formData.price.toString() === "" ||
        formData.description === "" ||
        formData.condition === "" ||
        formData.size === "" ||
        formData.name === ""
      ) {
        showToast("Please fill in all details", SeverityColorEnum.Error);
        setProductLoading(false);
        return;
      }

      formData.is_hidden = productQuery?.data?.is_hidden as boolean;
      formData.retailer_id = retailer?.id as string;
      formData.storefront_id = storeFrontId as string;

      await supabaseFetcher(
        supabase.from("products").update(formData).eq("id", productId),
      );
      showToast("Product updated successfully", SeverityColorEnum.Success);
      navigate(`/${storeFrontId}/admin/products`);
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      setProductLoading(false);
      throw e;
    }
  };

  useLoadingImage();

  return (
    <div className="w-11/12 md:w-3/4 mx-auto py-10">
      <Link
        to={`/${storeFrontId}/admin/products`}
        className="flex flex-row items-center justify-start  "
      >
        {" "}
        <LeftOutlined /> Cancel{" "}
      </Link>
      <p className="text-center text-xl">Edit this product</p>

      <form onSubmit={handleSubmit} className="shadow-xl px-5 pb-5 rounded-md">
        <div className="flex flex-row items-center overflow-x-auto  overflow-y-hidden my-6">
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
              disabled={productLoading}
              type="file"
              id="image-input"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
          </div>

          {photosQuery.data !== undefined &&
          photosQuery?.data?.product_images?.length > 0
            ? photosQuery.data?.product_images?.map((image, index) => (
                <div
                  key={index}
                  className="mr-1  flex flex-shrink-0  items-center
              justify-between relative pulse-loading "
                >
                  <img
                    className=" w-32 h-32 loading-image object-cover opacity-0 "
                    alt={`product-image-${index++}`}
                    src={image.url}
                    loading="eager"
                  />

                  <button
                    disabled={productLoading || deleteLoading}
                    onClick={() => handleDeleteFile(image.file_name)}
                    type={"button"}
                    className="absolute top-0 right-0
        shadow-lg  rounded-full p-1 
         flex flex-col items-start justify-center text-white bg-error
         "
                  >
                    {deleteLoading && (
                      <LoadingIndicator heightWidthXs={20} heightWidthMd={20} />
                    )}
                    {!deleteLoading && <DeleteOutlined />}
                  </button>
                </div>
              ))
            : null}
        </div>

        <label className="" htmlFor="category">
          Category <span className="text-error">*</span>
        </label>
        <div className="flex flex-row items-end justify-between mb-3">
          <select
            disabled={productLoading}
            id="category"
            placeholder="Category"
            {...register("category")}
            className="w-1/2"
          >
            <option value="" defaultChecked hidden>
              Select a category
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
            disabled={productLoading}
            onClick={() => handleAddCategory()}
            type="button"
            className="btn-primary w-1/3
          "
          >
            <PlusOutlined /> Category
          </button>
        </div>

        <label>
          Size <span className="text-error">*</span>{" "}
        </label>
        <div className="flex flex-row items-end justify-between mb-3">
          <select
            disabled={productLoading}
            {...register("size")}
            className="w-1/2  "
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
            disabled={productLoading}
            onClick={handleAddSize}
            type="button"
            className="btn-primary w-1/3"
          >
            <PlusOutlined /> Size
          </button>
        </div>

        <label>
          Condition <span className="text-error">*</span>
        </label>
        <div className="flex flex-row items-end justify-between mb-3">
          <select
            disabled={productLoading}
            {...register("condition")}
            placeholder="Condition"
            className="w-1/2"
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
            disabled={productLoading}
            onClick={handleAddCondition}
            type="button"
            className="btn-primary w-1/3"
          >
            {" "}
            <PlusOutlined /> Condition
          </button>
        </div>

        <label>
          Product name <span className="text-error">*</span>{" "}
        </label>
        <input
          placeholder="Product name"
          {...register("name")}
          disabled={productLoading}
          className="_mb-3"
        />

        <label>
          Product description <span className="text-error">*</span>{" "}
        </label>
        <textarea
          disabled={productLoading}
          {...register("description")}
          placeholder="Product description"
          className=" mb-3"
        ></textarea>

        <label>
          Units available <span className="text-error">*</span>{" "}
        </label>
        <input
          type="number"
          disabled={productLoading}
          {...register("stock")}
          placeholder="Units available"
        />
        <p className="text-[grey] mb-3 text-center text-xs">
          {" "}
          A value of '0' means the product is sold out{" "}
        </p>

        <label>
          Product Price <span className="text-error">*</span>{" "}
        </label>

        <input
          disabled={productLoading}
          type="number"
          {...register("price")}
          placeholder="Product price"
          className="mb-3"
        />

        <button
          disabled={productLoading}
          type="submit"
          className="btn-primary w-full"
        >
          {productLoading && (
            <LoadingIndicator heightWidthXs={20} heightWidthMd={30} />
          )}
          {!productLoading && "Edit Product"}
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
                disabled={dataLoading}
                className="border-2 outline-primary border-primary
                rounded-lg pl-2"
                name="popoverPurpose"
              />
              <br />
              <button
                disabled={dataLoading}
                className="bg-primary text-white px-3 py-1 flex
               flex-row items-center justify-center rounded-lg w-full"
                type="submit"
              >
                {dataLoading && (
                  <LoadingIndicator heightWidthXs={20} heightWidthMd={30} />
                )}
                {!dataLoading && (
                  <>
                    <PlusOutlined /> Add
                  </>
                )}
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
