import { Navbar, WebpapFooter } from "../../components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabase.ts";
import { useAppContext } from "../../contexts/AppContext.tsx";
import { PostgrestError } from "@supabase/supabase-js";
import { SeverityColorEnum } from "../../common/enums";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, watch } = useForm();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const handleShowPassword = (value: any) => {
    setShowPassword(value.target.checked);
  };

  const handleError = (error: PostgrestError | any | null) => {
    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = watch();

    const { data: user, error: authError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
    handleError(authError);

    if (user) {
      const { data: retailer } = await supabase
        .from("retailers")
        .select()
        .eq("id", user.user?.id)
        .single();
      if (retailer) navigate(`/${retailer.businessName}/admin`);
    }
  };

  return (
    <>
      <Navbar routesRole="app" />
      <div
        className="flex flex-col items-center justify-center
       shadow-lg w-3/4 md:w-3/5 mx-auto mt-44 mb-80 rounded-md "
      >
        <p className="font-bold text-lg md:text-2xl  ">Login</p>
        <p className="my-1 md:text-lg ">Welcome back admin!</p>

        <form
          className="flex flex-col items-center justify-center w-4/5 md:w-3/5 "
          onSubmit={onSubmit}
        >
          <input
            placeholder="Email"
            {...register("email", { required: true })}
            className="border-2 border-primary rounded-md 
                 py-2 md:py-2.5  pl-2 md:pl-3 w-full focus:outline-primary
                  mb-5"
          />

          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-2 border-primary rounded-md
                  py-2 md:py-2.5 pl-2 md:pl-3 w-full focus:outline-primary
                  focus:outline-primary "
          />

          <div className="flex flex-row items-center justify-start mr-auto ">
            <input
              type={"checkbox"}
              id="show-password"
              onChange={handleShowPassword}
              className="mr-2 w-4 h-4"
            />

            <label htmlFor="show-password" className="text-sm">
              Show password{" "}
            </label>
          </div>

          <button
            type="submit"
            className="bg-[#A57E5D] text-[#fff] py-1 md:py-0.5 w-full
                  rounded-lg border w-230px md:text-lg mt-4 shadow-lg "
          >
            Login
          </button>

          <p className="text-sm md:text-base text-center mt-2 mb-10">
            Don't have an account?
            <br className="md:hidden" />
            <Link to={"/sign-up"} className="text-link">
              {" "}
              sign up{" "}
            </Link>
          </p>
        </form>
      </div>
      <WebpapFooter />
    </>
  );
};
