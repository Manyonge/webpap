import { WebpapFooter, WebpapNavBar } from "../../components";
import { Formik } from "formik";

export const Signup = () => {
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
    <div>
      <WebpapNavBar />
      <p className="text-center font-bold text-lg md:text-xl mt-6">
        Create your retailer account
      </p>

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
            className="w-64 md:w-1/2 mx-auto  border"
            onSubmit={handleSubmit}
          >
            <div className="border ">
              <p>Personal details</p>
            </div>

            <div></div>
          </form>
        )}
      </Formik>

      <WebpapFooter />
    </div>
  );
};
