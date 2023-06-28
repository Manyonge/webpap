import { Button, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export const WebpapNavBar = () => {
  const { pathname } = useLocation();

  const items = [
    {
      key: "1",
      label: (
        <Link to={"/"}>
          {" "}
          <button
            className={`px-5 py-1 rounded-md text-sm w-full  ${
              pathname === "/" ? "btn-primary" : ""
            }`}
          >
            Home
          </button>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to={"/pricing"}>
          {" "}
          <button
            className={`px-5 py-1 rounded-md text-sm w-full ${
              pathname === "/pricing" ? "btn-primary" : ""
            }`}
          >
            Pricing
          </button>
        </Link>
      ),
    },

    {
      key: "3",
      label: (
        <Link to={"/market-place"}>
          <button
            className={`px-5 py-1 rounded-md text-sm w-full  ${
              pathname === "/market-place" ? "btn-primary" : ""
            }`}
          >
            Market place
          </button>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link to={"/sign-up"}>
          {" "}
          <button
            className={`px-5 py-1 rounded-md text-sm w-full ${
              pathname === "/sign-up" ? "btn-primary" : ""
            }`}
          >
            Retailer Sign up
          </button>
        </Link>
      ),
    },
    {
      key: "5",
      label: (
        <Link to={"/login"}>
          {" "}
          <button
            className={`px-5 py-1 rounded-md text-sm w-full  ${
              pathname === "/login" ? "btn-primary" : ""
            }`}
          >
            Retailer Login
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-row justify-between items-center pl-5 pr-5 md:pr-0 h-10 md:h-12 sticky top-0 Paper ">
      <Link to={"/"} className="font-bold md:text-lg">
        Webpap
      </Link>

      <div className="md:flex flex-row hidden ">
        <Link to={"/"}>
          <button
            className={`px-5 py-1 rounded-md text-sm  ${
              pathname === "/" ? "btn-primary" : ""
            }`}
          >
            Home
          </button>
        </Link>
        <Link to={"/pricing"}>
          <button
            className={`px-5 py-1 rounded-md text-sm  ${
              pathname === "/pricing" ? "btn-primary" : ""
            }`}
          >
            Pricing
          </button>
        </Link>
        <Link to={"/market-place"}>
          <button
            className={`px-5 py-1 rounded-md text-sm  ${
              pathname === "/market-place" ? "btn-primary" : ""
            }`}
          >
            Market place
          </button>
        </Link>

        <Link to={"/sign-up"}>
          <button
            className={`px-5 py-1 rounded-md text-sm  ${
              pathname === "/sign-up" ? "btn-primary" : ""
            }`}
          >
            Retailer Sign up
          </button>
        </Link>

        <Link to={"/login"}>
          <button
            className={`px-5 py-1 rounded-md text-sm  ${
              pathname === "/login" ? "btn-primary" : ""
            }`}
          >
            Retailer Login
          </button>
        </Link>
      </div>

      <Dropdown menu={{ items }} trigger={["click"]} className="md:hidden">
        <Button type="text" icon={<MenuOutlined />} />
      </Dropdown>
    </div>
  );
};
