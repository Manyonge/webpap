import { WebpapFooter, WebpapNavBar } from "../../components";
import styles from "./style.module.css";
import { Form, message, Upload, UploadFile, UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const UploadButton = (props: { loading: boolean }) => {
  const { loading } = props;
  return (
    <div style={{}}>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
};

export const Signup = () => {
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [passportLoading, setPassportLoading] = useState(false);

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "uploading") {
      setPassportLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setPassportLoading(false);
        setPassportPhoto(url);
      });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  return (
    <div className={styles.SignupPage}>
      <WebpapNavBar />
      <p>Create your retailer account</p>

      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <div className={styles.PersonalDetails}>
          <p>Personal details</p>
          <div className={styles.PersonalColOne}>
            <Upload
              name="passportPhoto"
              listType="picture-circle"
              className={styles.PassportPhoto}
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {passportPhoto ? (
                <img
                  src={passportPhoto}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                <UploadButton loading={passportLoading} />
              )}
            </Upload>
          </div>
          <p>
            {" "}
            Upload a clear passport
            <br /> photo of yourself{" "}
          </p>
          <div className={styles.PersonalContent}>
            <div className={styles.PersonalColTwo}>hello</div>
            <div className={styles.PersonalColThree}>hello</div>
          </div>
        </div>

        <div className={styles.BusinessDetails}>hello</div>
      </Form>

      <WebpapFooter />
    </div>
  );
};
