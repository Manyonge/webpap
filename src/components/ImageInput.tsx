import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { supabase } from "../supabase.ts";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { useQuery, useQueryClient } from "react-query";
import { uploadPhoto } from "../services";
import { useGetRetailer } from "../common/hooks";
import { SeverityColorEnum } from "../common/enums";
import { Product } from "../common/interfaces";
import { PostgrestError } from "@supabase/supabase-js";

export const ImageInput = (props: {
  setProductImages: any;
  url: Blob | MediaSource;
  index: number;
  forEditing?: boolean;
  productImages?: any;
  imageName?: string;
}) => {
  const { url, productImages, setProductImages, index, forEditing, imageName } =
    props;
  const { productID } = useParams();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const { retailer } = useGetRetailer();

  const fetchProduct = async () => {
    const {
      data,
      error,
    }: { data: Product | null; error: PostgrestError | null } = await supabase
      .from("products")
      .select()
      .eq("id", productID)
      .single();
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
  };

  const productQuery = useQuery(["singleProduct"], fetchProduct);

  const handleFileChange = async (event: any) => {
    if (forEditing) {
      const publicUrl = await uploadPhoto(
        productImages[index].url,
        `product images/${productQuery?.data?.name}-${retailer?.id}-${
          index + 1
        }-img.png`,
      );
      const images = productImages;
      images[index].url = publicUrl;
      const { error } = await supabase
        .from("products")
        .update({ productImages: images })
        .eq("id", productID);
      if (error) {
        showToast(error.message);

        throw new Error(error.message);
      }
      queryClient.invalidateQueries("product");
    }

    setProductImages((prev: any) => {
      const newBatch = [...prev];
      newBatch[index].url = event.target.files[0];
      return newBatch;
    });
  };

  const handleDeleteFile = async () => {
    if (forEditing) {
      const images = [];
      productImages.forEach((image: any) => {
        images.push(image.url);
      });
      images[index] = "";
      const { error } = await supabase
        .from("products")
        .update({ productImages: images })
        .eq("id", productID);
      if (error) {
        showToast(error.message);

        throw new Error(error.message);
      }

      const { error: storageError } = await supabase.storage
        .from("webpap storage")
        .remove([imageName as string]);
      if (storageError) {
        showToast(storageError.message);

        throw new Error(storageError.message);
      }
      await queryClient.invalidateQueries("product");
      return;
    }
    setProductImages((prev: any) => {
      const newBatch = [...prev];
      newBatch[index].url = false;
      return newBatch;
    });
  };

  if (!url)
    return (
      <div
        className=" rounded-md border-2 border-dashed border-[grey]
       bg-[lightGrey] flex flex-row items-center
        justify-center mr-4  "
      >
        <label
          className="w-32 h-32  flex flex-row items-center justify-center "
          htmlFor={`image-${index}`}
        >
          <PlusOutlined />
        </label>
        <input
          type="file"
          id={`image-${index}`}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );

  if (typeof url === "string")
    return (
      <div className="mr-1  flex flex-shrink-0  items-center justify-between relative  w-36 h-36">
        <img className=" w-32 h-32  object-cover " src={url} />

        <button
          onClick={handleDeleteFile}
          type={"button"}
          className="absolute top-0 right-0  bg-white
        shadow-lg  rounded-full p-1
         flex flex-col items-start justify-center
         "
        >
          <DeleteOutlined />
        </button>
      </div>
    );

  if (typeof url !== "string" && url)
    return (
      <div className="mr-1  flex flex-shrink-0  items-center justify-between relative  w-36 h-36">
        <img
          className=" w-32 h-32  object-cover "
          src={URL.createObjectURL(url)}
        />

        <button
          onClick={handleDeleteFile}
          type={"button"}
          className="absolute top-0 right-0  bg-white
        shadow-lg  rounded-full p-1
         flex flex-col items-start justify-center
         "
        >
          <DeleteOutlined />
        </button>
      </div>
    );
};
