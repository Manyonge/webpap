import { WebpapFooter, WebpapNavBar } from "../../components";
import { Link } from "react-router-dom";

export const WebpapHome = () => {
  return (
    <>
      <WebpapNavBar />
      <div
        className="h-72   primaryBg flex justify-center items-center
       flex-col"
      >
        <p className="text-white  mb-2 text-center text-lg md:text-2xl text-[#fff] ">
          Instantly sell your clothing <br /> and footwear products on <br />
          the web!{" "}
        </p>

        <Link to={"/sign-up"}>
          <button className=" md:text-md text-sm text-[#fff] border rounded-full px-2 py-1 ">
            {" "}
            Get Started{" "}
          </button>
        </Link>
      </div>

      <div className="h-72 flex justify-center items-center ">
        <p className="text-center text-lg md:text-2xl  ">
          Get your own e-commerce
          <br />
          website, receive orders and
          <br />
          payments in your sleep!
        </p>
      </div>

      <div className="primaryBg h-72 flex justify-center items-center ">
        <p className=" text-[#fff] text-center text-lg md:text-2xl">
          No Startup costs
          <br />
          No developers or lines of code needed!
        </p>
      </div>
      <WebpapFooter />
    </>
  );
};
