import { Navbar, WebpapFooter } from "../components";

export const Pricing = () => {
  return (
    <>
      <Navbar routesRole="app" />
      <div className="flex flex-col justify-center items-center h-72 primaryBg text-[#fff]">
        <div className="flex flex-row items-center mb-4 ">
          <div>
            <p className="text-center text-4xl md:text-5xl ">8%</p>

            <p className="text-lg md:text-2xl ">Transaction cost</p>
          </div>

          <div className="h-28 md:h-40 w-1 md:w-1.5 mx-6 rounded-full bg-[#fff] " />

          <div>
            <p className="text-center text-4xl md:text-5xl "> 100 KSH </p>

            <p className="text-lg md:text-2xl ">Per withdrawal</p>
          </div>
        </div>
        <p className="md:text-lg">
          {" "}
          No <span className="text-[#890404]"> subscription fees </span>{" "}
        </p>

        <p className="md:text-lg">
          {" "}
          No <span className="text-[#890404]"> extra charges </span>{" "}
        </p>
      </div>

      <div className="flex flex-col justify-center items-center h-72 px-12">
        <ol className="list-disc md:text-lg ">
          <li>
            Custom e-commerce store front where your customers can explore and
            shop
          </li>

          <li>Receive payments via M-PESA</li>

          <li>Deliver country wide with Pickup Mtaani</li>

          <li>Free advertising on our market place</li>
        </ol>
      </div>

      <WebpapFooter />
    </>
  );
};
