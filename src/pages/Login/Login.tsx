import { WebpapFooter, WebpapNavBar } from "../../components";
import { Form, Input } from "antd";

export const Login = () => {
  const onFinish = (values: { email: string; password: string }) => {
    console.log(values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  return (
    <>
      <WebpapNavBar />
      <div className="flex flex-col items-center justify-center shadow-lg mx-auto mt-44 mb-60 w-280px md:w-400px rounded-md ">
        <p className="font-bold text-lg md:text-xl  ">Login</p>
        <p className="my-1">Welcome back admin!</p>

        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ remember: true }}
          autoComplete="off"
          className=" w-230px md:w-280px "
        >
          <Form.Item
            name={"email"}
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input size="middle" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password placeholder="Password" size="middle" />
          </Form.Item>

          <button
            type="submit"
            className="bg-[#A57E5D] text-[#fff] py-1 md:py-0.5 md:w-280px rounded-lg mb-10  border w-230px md:text-lg"
          >
            Login
          </button>
        </Form>
      </div>
      <WebpapFooter />
    </>
  );
};
