import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { supabase } from "../supabase.ts";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";

export const ImageInput = (props: {
  setProductImages: any;
  url: Blob | MediaSource;
  index: number;
  forEditing?: boolean;
  productImages?: any;
}) => {
  const { url, productImages, setProductImages, index, forEditing } = props;
  const { productID } = useParams();
  const { showToast } = useAppContext();
  const handleFileChange = (event: any) => {
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
  return (
    <div className="mr-1  flex flex-shrink-0  items-center justify-between relative  w-36 h-36">
      <img
        className=" w-32 h-32  object-cover "
        src={typeof url === "string" ? url : URL.createObjectURL(url)}
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
