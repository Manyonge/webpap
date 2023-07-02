import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

export const ImageInput = (props: {
  setProductImages: any;
  url: Blob | MediaSource;
  index: number;
}) => {
  const { url, setProductImages, index } = props;

  const handleFileChange = (event: any) => {
    setProductImages((prev: any) => {
      const newBatch = [...prev];
      newBatch[index].url = event.target.files[0];
      return newBatch;
    });
  };

  const handleDeleteFile = () => {
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
        src={URL.createObjectURL(url)}
      />

      <button
        onClick={handleDeleteFile}
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
