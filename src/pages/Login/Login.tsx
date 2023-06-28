import { WebpapFooter, WebpapNavBar } from "../../components";
import { Button, Form, Input } from "antd";
import styles from "./style.module.css";

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
      <div className={styles.Login}>
        <p>Login</p>
        <p>Welcome back admin!</p>

        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            name={"email"}
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="middle"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
      <WebpapFooter />
    </>
  );
};
