import {WebpapFooter, WebpapNavBar} from "../../components";
import {Formik} from "formik";
import {useState} from "react";
import {Link} from "react-router-dom";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (value: any) => {
    setShowPassword(value.target.checked);
  };
  const validateForm = (values: { email: string; password: string }) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const onSubmit = (
    values: { email: string; password: string },
    { setSubmitting }: any,
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <>
      <WebpapNavBar />
      <div className="flex flex-col items-center justify-center shadow-lg w-3/4 md:w-3/5 mx-auto mt-44 mb-60 rounded-md ">
        <p className="font-bold text-lg md:text-xl  ">Login</p>
        <p className="my-1">Welcome back admin!</p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validateForm}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form
              className="flex flex-col items-center justify-center w-4/5 md:w-3/5 "
              onSubmit={handleSubmit}
            >
              <input
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Email"
                className="border-2 border-primary rounded-md text-sm py-1 pl-2 md:pl-3 w-full outline-none md:h-10"
              />
              <p className="text-sm text-error mb-4 ">
                {errors.email && touched.email && errors.email}
              </p>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
                className="border-2 border-primary rounded-md text-sm py-1 pl-2 md:pl-3 w-full outline-none h-10"
              />

              <p className="text-sm text-error mb-4 ">
                {errors.password && touched.password && errors.password}
              </p>

              <div className="flex flex-row items-center justify-start mr-auto ">
                <input
                  type={"checkbox"}
                  id="show-password"
                  onChange={handleShowPassword}
                  className="mr-2 w-3 h-3   "
                />

                <label htmlFor="show-password" className="text-sm">
                  Show password{" "}
                </label>
              </div>

              {errors.password && touched.password && errors.password}

              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-[#A57E5D] text-[#fff] py-1 md:py-0.5 w-full  rounded-lg border w-230px md:text-lg mt-4 "
              >
                Login
              </button>

              <p className="text-sm text-center mt-2 mb-10">
                Don't have an account?
                <br className="md:hidden" />
                <Link to={"/sign-up"} className="text-link">
                  {" "}
                  sign up{" "}
                </Link>
              </p>
            </form>
          )}
        </Formik>
      </div>
      <WebpapFooter />
    </>
  );
};
