import { Navbar } from "../../components";
import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Retailer } from "../../common/interfaces";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../contexts";
import { supabase } from "../../supabase.ts";
import { useNavigate } from "react-router-dom";
import { SeverityColorEnum } from "../../common/enums";

const personalDetailsCol = [
  {
    label: "Full name",
    id: "fullName",
    name: "full_name",
    htmlFor: "fullName",
    type: "text",
  },
  {
    label: "Phone Number",
    id: "phoneNumber",
    name: "phone_number",
    htmlFor: "phoneNumber",
    type: "number",
  },
  {
    label: "ID Number",
    id: "idNumber",
    name: "id_number",
    htmlFor: "idNumber",
    type: "number",
  },
];

const businessDetailsCol = [
  {
    label: "Business Name",
    id: "businessName",
    name: "business_name",
    htmlFor: "businessName",
    type: "text",
  },

  {
    label: "Login email",
    id: "loginEmail",
    name: "login_email",
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
  {
    label: "Instagram Handle",
    id: "instagramHandle",
    name: "instagram_handle",
    htmlFor: "instagramHandle",
    type: "text",
  },
];

export const Signup = () => {
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const { register, watch } = useForm<Retailer>();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [message, setMessage] = useState("Create retailer account");
  const { showToast, uploadPhoto, supabaseFetcher } = useAppContext();
  const navigate = useNavigate();

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

    setDisableSubmit(true);
    setMessage("Creating user...");

    try {
      const userData = await supabaseFetcher(
        supabase.auth.signUp({
          email: data.login_email,
          password: data.password as string,
        }),
      );
      setMessage("uploading passport photo...");

      const passportUrl = await uploadPhoto(
        passportPhoto,
        `passport photos/${userData.user?.id}-passport-photo`,
      );

      setMessage("Uploading logo...");

      const logoUrl = await uploadPhoto(
        businessLogo,
        `business logos/${userData.user?.id}-business-logo`,
      );

      data.passport_photo = passportUrl;
      data.business_logo = logoUrl;
      data.wallet_balance = 0;
      data.id = userData.user?.id;
      delete data.password;
      setMessage("Creating your retailer account ...");

      await supabaseFetcher(supabase.from("retailers").insert([data]));

      setMessage("Done");
      setDisableSubmit(false);

      showToast("Account created successfully!", SeverityColorEnum.Success);
      navigate("/login");
    } catch (e: any) {
      if (
        e.message ===
        'duplicate key value violates unique constraint "retailers_businessName_key"'
      ) {
        showToast(
          "A user with the same business name already exists",
          SeverityColorEnum.Error,
        );
        setMessage("Create retailer account");

        setDisableSubmit(false);
        return;
      }

      if (e.message === "user already registered") {
        showToast("Email address already in use", SeverityColorEnum.Error);
        setMessage("Create retailer account");

        setDisableSubmit(false);
        return;
      }

      showToast(e.message, SeverityColorEnum.Error);
      setMessage("Create retailer account");
      setDisableSubmit(false);

      throw e;
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
            Your personal details
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
            <div className="w-fit h-fit rounded-full mx-auto ">
              <label htmlFor="passport-photo" className="w-fit">
                <div
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-lightGrey mx-auto
                      flex flex-col items-center justify-center border-2
                       border-dashed border-[grey]"
                >
                  <PlusOutlined />
                  <p className="text-center text-xs ">
                    Passport
                    <br /> photo
                  </p>
                </div>
              </label>{" "}
              <input
                type="file"
                id="passport-photo"
                onChange={handlePassportPhoto}
                className="hidden"
              />
            </div>
          )}

          <div className="flex flex-col items-center justify-center pb-3 px-2 ">
            {personalDetailsCol.map(({ label, id, name, type }, index) => (
              <input
                key={index}
                placeholder={label}
                id={id}
                type={type}
                {...register(name, { required: true })}
                className="border border-primary pl-2 py-1.5 md:py-2 rounded-lg my-2
                     focus:outline-primary w-11/12 md:w-1/2"
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
            <div className="w-fit h-fit rounded-full mx-auto">
              <label htmlFor="business-logo">
                <div
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full
                   bg-lightGrey mx-auto
                      flex flex-col items-center
                       justify-center border-2 border-dashed border-[grey]"
                >
                  <PlusOutlined />

                  <p className="text-center text-xs ">
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
            </div>
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
                     focus:outline-primary w-11/12 md:w-1/2"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={disableSubmit}
          className="bg-primary text-[#fff] mx-auto mt-10
               mb-40 w-3/4 py-1.5 rounded-xl shadow-lg"
        >
          {" "}
          {message}
        </button>
      </form>
    </div>
  );
};
