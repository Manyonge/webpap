import { DeleteOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "../../../common/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetRetailer } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts";
import { SeverityColorEnum } from "../../../common/enums";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery, useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { LoadingIndicator } from "../../../components";

export const UploadProduct = () => {
  const { storeFrontId } = useParams();
  const { retailer } = useGetRetailer();
  const { register, watch } = useForm<Product>();
  const [productLoading, setProductLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast, supabaseFetcher, uploadPhoto } = useAppContext();

  const [chosenImages, setChosenImages] = useState<File[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPurpose, setDialogPurpose] = useState<
    "" | "category" | "size" | "condition"
  >("");

  const fetchCategories = async () => {
    try {
      return await supabaseFetcher(
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
    setDataLoading(true);
    try {
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
      setDataLoading(false);
      throw e;
    }
  };

  const handleFileChange = (e: any) => {
    setChosenImages((prevState) => [...prevState, ...e.target.files]);
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setProductLoading(true);
    const formData = watch();
    if (chosenImages.length === 0) {
      showToast("You have not selected any images", SeverityColorEnum.Error);
      setProductLoading(false);
      return;
    }
    if (chosenImages.length > 10) {
      showToast("You can only upload up to 10 images", SeverityColorEnum.Error);
      setProductLoading(false);
      return;
    }

    const uploadedImages = [];

    if (
      formData.category === "" ||
      formData.size === "" ||
      formData.condition === "" ||
      formData.name === "" ||
      formData.description === "" ||
      formData.stock.toString() === "" ||
      formData.price.toString() === ""
    ) {
      showToast("Please fill in all details", SeverityColorEnum.Error);
      setProductLoading(false);
      return;
    }
    try {
      for (const i in chosenImages) {
        const uniqueId = uuidv4();
        const publicUrl = await uploadPhoto(
          chosenImages[i],
          `product images/${uniqueId}-product-photo.webp`,
        );
        uploadedImages.push({
          url: publicUrl,
          file_name: `product images/${uniqueId}-product-photo.webp`,
        });
      }
      formData.product_images = uploadedImages;
      formData.is_hidden = false;
      formData.retailer_id = retailer?.id as string;
      formData.storefront_id = storeFrontId as string;

      await supabaseFetcher(supabase.from("products").insert([formData]));
      setProductLoading(false);
      showToast("Product uploaded successfully", SeverityColorEnum.Success);
      navigate(`/${storeFrontId}/admin/products`);
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  return (
    <div className="w-11/12 md:w-3/4 mx-auto py-10">
      <Link
        to={`/${storeFrontId}/admin/products`}
        className="flex flex-row items-center justify-start "
      >
        {" "}
        <LeftOutlined /> Cancel{" "}
      </Link>
      <h1 className="text-center text-xl ">Upload a product</h1>

      <form onSubmit={handleSubmit} className="shadow-xl px-5 pb-5 rounded-md">
        <div
          className="flex flex-row items-center
         overflow-x-auto  overflow-y-hidden my-6"
        >
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

          {chosenImages.length > 0 &&
            chosenImages.map((image, index) => (
              <div
                key={index}
                className="mr-1  flex flex-shrink-0  items-center
              justify-between relative  w-36 h-36"
              >
                <img
                  alt={`product-image-${index++}`}
                  className=" w-32 h-32  object-cover "
                  src={URL.createObjectURL(image)}
                />

                <button
                  disabled={productLoading}
                  onClick={() => handleDeleteFile(image)}
                  type={"button"}
                  className="absolute top-0 right-0  
        shadow-lg  rounded-full p-1 bg-error text-white
         flex flex-col items-start justify-center
         "
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}
        </div>

        <label htmlFor="category">
          Category <span className="text-error">*</span>
        </label>
        <div className="flex flex-row items-center justify-between">
          <select
            disabled={productLoading}
            id="category"
            placeholder="Category"
            {...register("category")}
            className="w-1/2  "
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
            className="btn-primary w-1/3  "
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
            placeholder="Size"
            {...register("size")}
            className="w-1/2"
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
            className="text-white py-0.5
             rounded-md shadow-xl bg-primary w-1/3
          flex flex-row items-center justify-center px-8"
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
          disabled={productLoading}
          {...register("name")}
          className="mb-3"
        />
        <label>
          Product description <span className="text-error">*</span>{" "}
        </label>
        <textarea
          disabled={productLoading}
          {...register("description")}
          placeholder="Product description"
          className="mb-3"
        />
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
          type="number"
          {...register("price")}
          disabled={productLoading}
          placeholder="Product price"
          className="mb-3"
        />

        <button
          disabled={productLoading}
          type="submit"
          className="btn-primary w-full "
        >
          {productLoading && (
            <LoadingIndicator heightWidthXs={20} heightWidthMd={30} />
          )}
          {!productLoading && "Upload Product"}
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
                {" "}
                {dataLoading && (
                  <LoadingIndicator heightWidthXs={20} heightWidthMd={30} />
                )}
                {!dataLoading && (
                  <p>
                    {" "}
                    <PlusOutlined /> Add{" "}
                  </p>
                )}
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
