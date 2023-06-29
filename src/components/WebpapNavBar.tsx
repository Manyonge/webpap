import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";

export const WebpapNavBar = () => {
  const { pathname } = useLocation();

  const popoverItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Pricing",
      path: "/pricing",
    },
    {
      label: "Market Place",
      path: "/market-place",
    },

    {
      label: "Retailer sign up",
      path: "/sign-up",
    },
    {
      label: "Retailer Login",
      path: "/login",
    },
  ];

  return (
    <div className="flex flex-row justify-between items-center pl-5 pr-5 md:pr-4 h-10 md:h-12 sticky top-0 Paper ">
      <Link to={"/"} className="font-bold md:text-lg">
        Webpap
      </Link>

      <div className="md:flex flex-row hidden ">
        {popoverItems.map(({ label, path }) => (
          <Link to={path}>
            <button
              className={`px-5 py-1 rounded-md text-sm  ${
                pathname === path ? "btn-primary" : ""
              }`}
            >
              {label}
            </button>
          </Link>
        ))}
      </div>

      <Popover.Root>
        <Popover.Trigger className="md:hidden ">
          <MenuOutlined />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="flex flex-col bg-[#fff]  px-2 py-1 rounded-lg  mt-2.5 shadow-lg mr-2 ">
            {popoverItems.map(({ label, path }) => (
              <Link to={path}>
                <div
                  className={`px-5 py-1 w- rounded-md text-sm text-center  ${
                    pathname === path ? "btn-primary" : ""
                  }`}
                >
                  {label}
                </div>
              </Link>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
