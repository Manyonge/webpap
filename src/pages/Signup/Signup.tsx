import { Navbar } from "../../components";
import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Retailer } from "../../common";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { supabase } from "../../supabase.ts";

const personalDetailsCol = [
  {
    label: "Full name",
    id: "fullName",
    name: "fullName",
    htmlFor: "fullName",
    type: "text",
  },
  {
    label: "Phone",
    id: "phoneNumber",
    name: "phoneNumber",
    htmlFor: "phoneNumber",
    type: "text",
  },
  {
    label: "ID Number",
    id: "idNumber",
    name: "idNumber",
    htmlFor: "idNumber",
    type: "number",
  },
];

const businessDetailsCol = [
  {
    label: "Business Name",
    id: "businessName",
    name: "businessName",
    htmlFor: "businessName",
    type: "text",
  },

  {
    label: "Login email",
    id: "loginEmail",
    name: "loginEmail",
    htmlFor: "loginEmail",
    type: "email",
  },

  {
    label: "Login password",
    id: "password",
    name: "password",
    htmlFor: "password",
    type: "text",
  },
];

export const Signup = () => {
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const { register, watch } = useForm<Retailer>();
  const { showToast } = useAppContext();

  useEffect(() => {
    const test = async () => {
      const response = await supabase.from("users").select();
      console.log({ response });

      const { error } = await supabase
        .from("users")
        .insert({ name: "Denmark" });
      console.log(error);
    };
    test();
  }, []);

  const handlePassportPhoto = (value: any) => {
    setPassportPhoto(value.target.files[0]);
  };

  const handleDeletePassport = () => {
    setPassportPhoto(null);
  };

  const handleBusinessLogo = (value: any) => {
    setBusinessLogo(value.target.files[0]);
  };

  const handleDeleteBusiness = () => {
    setBusinessLogo(null);
  };

  const onSubmit = async (e: any) => {
    e?.preventDefault();
    const data: Retailer = watch();
    if (passportPhoto === null || businessLogo === null) {
      showToast("You have not included all photos");
      return;
    }
    for (const key in data) {
      if (data[key] === "") {
        showToast("Please fill in all fields");
        return;
      }
    }
  };

  return (
    <div>
      <Navbar routesRole="app" />
      <p className="text-center font-bold text-lg md:text-2xl mt-6 mb-8">
        Create your retailer account
      </p>

      <form
        className="w-9/12 mx-auto flex flex-col items-center justify-center  "
        onSubmit={onSubmit}
      >
        <div className="shadow-lg rounded-lg w-full ">
          <p className="text-center text-lg md:text-xl font-bold">
            Personal details
          </p>

          {passportPhoto && (
            <div className="relative w-fit mx-auto pt-3 mt-2">
              <img
                src={URL.createObjectURL(passportPhoto)}
                alt="your passport photo"
                className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto object-cover "
              />
              <button onClick={handleDeletePassport}>
                <DeleteOutlined className="absolute top-0 right-0" />
              </button>
            </div>
          )}

          {!passportPhoto && (
            <>
              <label htmlFor="passport-photo">
                <div
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-lightGrey mx-auto
                      flex flex-col items-center justify-center border-2 border-dashed border-black  my-2 "
                >
                  <PlusOutlined />
                  <p className="text-center">
                    Passport
                    <br /> photo
                  </p>
                </div>
              </label>{" "}
              <input
                type="file"
                id="passport-photo"
                className="hidden"
                onChange={handlePassportPhoto}
              />
            </>
          )}

          <div className="flex flex-col items-center justify-center pb-3  ">
            {personalDetailsCol.map(({ label, id, name, type }, index) => (
              <input
                key={index}
                placeholder={label}
                id={id}
                type={type}
                {...register(name, { required: true })}
                className="border border-primary pl-2 py-1.5 md:py-2 rounded-lg my-2
                     focus:outline-primary"
              />
            ))}
          </div>
        </div>

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
                <div
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-lightGrey mx-auto
                      flex flex-col items-center justify-center border-2 border-dashed border-black  my-2 "
                >
                  <PlusOutlined />

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
            {businessDetailsCol.map(({ label, id, name, type }, index) => (
              <input
                id={id}
                key={index}
                placeholder={label}
                type={type}
                {...register(name, { required: true })}
                className="border border-primary pl-2 py-1.5 md:py-2 rounded-lg my-2
                     focus:outline-primary"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-[#fff] mx-auto mt-10
               mb-40 w-3/4 py-1.5 rounded-xl shadow-lg"
        >
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
};
