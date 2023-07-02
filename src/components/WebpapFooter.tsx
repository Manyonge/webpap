import {
  FacebookFilled,
  InstagramOutlined,
  TwitterCircleFilled,
} from "@ant-design/icons";

export const WebpapFooter = () => {
  return (
    <footer
      className="bg-[#313030] text-[#fff] flex justify-around
    py-12 items-center flex-col h-64  "
    >
      <p> Contact us:</p>
      <a href="mailto:webpapsuppport@gmail.com">webpapsuppport@gmail.com</a>
      <a href="tel:+254792586134">+254792586134</a>
      <div className="flex flex-row items-center justify-center">
        <a target="_blank" className="mx-2">
          {" "}
          <FacebookFilled />{" "}
        </a>
        <a target="_blank" href="">
          <TwitterCircleFilled />
        </a>
        <a target="_blank" href="" className="mx-2">
          <InstagramOutlined />
        </a>
      </div>
    </footer>
  );
};
