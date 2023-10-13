import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { supabase } from "../../../supabase.ts";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";
import { useForm } from "react-hook-form";

const businessDetailsCol = [
  {
    label: "Name",
    id: "businessName",
    name: "businessName",
    htmlFor: "businessName",
  },
];

export const RetailerAccount = () => {
  const { register } = useForm();
  const [businessLogo, setBusinessLogo] = useState(null);
  const { storeFrontID } = useParams();
  const { showToast } = useAppContext();

  useEffect(() => {
    const fetchRetailer = async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select()
        .eq("businessName", storeFrontID)
        .single();

      if (error) {
        showToast(error.message, SeverityColorEnum.Error);
        throw new Error(error.message);
      }
      return data;
    };
    fetchRetailer().then();
  }, []);

  const handleBusinessLogo = (value: any) => {
    setBusinessLogo(value.target.files[0]);
  };

  const handleDeleteBusiness = () => {
    setBusinessLogo(null);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div>
      <p className="text-center font-bold text-lg md:text-xl mt-6 mb-8">
        Update your retailer account
      </p>

      <form
        className="w-9/12 mx-auto flex flex-col items-center justify-center  "
        onSubmit={onSubmit}
      >
        <div className="shadow-lg rounded-lg mt-20 w-full ">
          <p className="text-center text-lg md:text-xl font-bold">
            Business details
          </p>

          {businessLogo && (
            <div className="relative w-fit mx-auto pt-3 mt-2">
              <img
                src={URL.createObjectURL(businessLogo)}
                alt="your passport photo"
                className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto object-cover "
              />
              <button onClick={handleDeleteBusiness}>
                <DeleteOutlined className="absolute top-0 right-0" />
              </button>
            </div>
          )}

          {!businessLogo && (
            <>
              <label htmlFor="business-logo">
                <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-primary mx-auto text-[#fff] flex flex-col items-center justify-center pt-3 mt-2 ">
                  <p className="text-center">
                    Business
                    <br /> logo
                  </p>
                </div>
              </label>{" "}
              <input
                type="file"
                id="business-logo"
                className="hidden"
                onChange={handleBusinessLogo}
              />
            </>
          )}

          <div className="flex flex-col items-center justify-center pb-3  ">
            {businessDetailsCol.map(({ label, id, name }) => (
              <input
                id={id}
                key={id}
                placeholder={label}
                {...register(name)}
                className="border pl-2 rounded-md my-2  outline-none"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-[#fff] mx-auto mt-6 mb-40 w-3/4 rounded-lg "
        >
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
};
