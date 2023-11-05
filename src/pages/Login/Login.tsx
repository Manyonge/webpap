import { LoadingIndicator, Navbar, WebpapFooter } from "../../components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../../supabase.ts";
import { useAppContext } from "../../contexts";
import { SeverityColorEnum } from "../../common/enums";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, watch } = useForm();
  const { supabaseFetcher, showToast } = useAppContext();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleShowPassword = (value: any) => {
    setShowPassword(value.target.checked);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = watch();

    try {
      const userResponse = await supabaseFetcher(
        supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        }),
      );

      const retailerResponse = await supabaseFetcher(
        supabase
          .from("retailers")
          .select()
          .eq("id", userResponse.user?.id)
          .single(),
      );
      navigate(`/${retailerResponse.business_name}/admin`);
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      setLoading(false);
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
          <label className="input-container mb-5">
            <input
              placeholder="Email"
              {...register("email", { required: true })}
              className=" input-field "
            />
            <span className="input-label">Email</span>
          </label>

          <label className="input-container mb-5">
            <input
              {...register("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
            />
            <span className="input-label">Password</span>
          </label>

          <div className="flex flex-row items-center justify-start mr-auto ">
            <input
              type={"checkbox"}
              id="show-password"
              onChange={handleShowPassword}
              className="mr-2 w-4 h-4 mt-3 "
            />

            <label htmlFor="show-password" className="text-sm mt-3 ">
              Show password{" "}
            </label>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary py-1 md:py-0.5 w-full
                  rounded-lg border w-230px md:text-lg mt-4 shadow-lg flex items-center justify-center "
          >
            {loading && (
              <LoadingIndicator heightWidthMd={25} heightWidthXs={20} />
            )}
            {!loading && "Login"}
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
