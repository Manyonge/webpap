import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation, useParams } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

export const Navbar = (props: { routesRole: "app" | "admin" }) => {
  const { routesRole } = props;
  const { pathname } = useLocation();
  const { storeFrontID } = useParams();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handlePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const appRoutes = [
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

  const adminRoutes = [
    {
      label: "Dashboard",
      path: `/${storeFrontID}/admin`,
    },
    { label: "Customers", path: `/${storeFrontID}/admin/customers` },
    { label: "Orders", path: `/${storeFrontID}/admin/orders` },
    { label: "Wallet", path: `/${storeFrontID}/admin/wallet` },
    { label: "Account", path: `/${storeFrontID}/admin/account` },
    { label: "Products", path: `/${storeFrontID}/admin/products` },
  ];

  const determineHomePath = () => {
    if (routesRole === "admin") {
      return { label: storeFrontID, path: `/${storeFrontID}/admin` };
    }

    return { label: "Webpap", path: "/" };
  };

  return (
    <div
      className="flex flex-row justify-between items-center pl-5 pr-5 md:pr-4
     bg-white h-10 md:h-12 sticky top-0 shadow-lg "
    >
      <Link to={determineHomePath().path} className="font-bold md:text-lg">
        {determineHomePath().label}
      </Link>

      {routesRole === "app" && (
        <div className="md:flex flex-row hidden ">
          {appRoutes.map(({ label, path }) => (
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
      )}

      {routesRole === "admin" && (
        <div className="md:flex flex-row hidden ">
          {adminRoutes.map(({ label, path }) => (
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
      )}

      <Popover.Root
        defaultOpen={false}
        open={popoverOpen}
        onOpenChange={handlePopover}
      >
        <Popover.Trigger className="md:hidden ">
          <MenuOutlined />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="flex flex-col bg-[#fff]  px-2 py-1 rounded-lg  mt-2.5 shadow-lg mr-2 ">
            {routesRole === "admin" &&
              adminRoutes.map(({ label, path }) => (
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

            {routesRole === "app" &&
              appRoutes.map(({ label, path }) => (
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
    </div>
  );
};
