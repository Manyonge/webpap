import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";

export const StoreFrontLayout = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { storeFrontID } = useParams();
  const { pathname } = useLocation();
  const routes = [
    { label: "Home", path: `/${storeFrontID}` },
    { label: "Shopping Cart", path: `/${storeFrontID}/shopping-cart` },
  ];

  const handlePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  return (
    <div className="h-screen ">
      <div
        className="flex flex-row justify-between items-center pl-5 pr-5
      md:pr-4 h-10 md:h-12 sticky top-0 shadow-lg
        md:px-10
        "
      >
        <Link
          to={`/${storeFrontID}`}
          className="hidden md:block font-bold text-lg"
        >
          {" "}
          {`${storeFrontID}`}{" "}
        </Link>

        <Popover.Root
          defaultOpen={false}
          open={popoverOpen}
          onOpenChange={handlePopover}
        >
          <Popover.Trigger className="md:hidden ">
            <MenuOutlined />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="flex flex-col bg-[#fff]  px-2 py-1
            rounded-lg  mt-2.5 shadow-lg mr-2 "
            >
              {routes.map(({ label, path }) => (
                <Link to={path} key={path}>
                  <div
                    onClick={handlePopover}
                    className={`px-5 py-1 w- rounded-md text-sm w-full text-center  ${
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

        <input
          type="search"
          className="border outline-none rounded-full pl-2
            w-2/3 md:w-1/3 mx-auto "
        />

        <div className="hidden md:block">
          {routes.map(({ label, path }) => (
            <Link to={path} key={path}>
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

        <Link to={`/${storeFrontID}/shopping-cart`} className="md:hidden">
          <ShoppingCartOutlined className="text-" />
        </Link>
      </div>

      <Outlet />
    </div>
  );
};
