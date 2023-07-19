import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { supabase } from "../supabase.ts";

export const Navbar = (props: { routesRole: "app" | "admin" }) => {
  const { routesRole } = props;
  const { pathname } = useLocation();
  const { storeFrontID } = useParams();
  const navigate = useNavigate();

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
    { label: "Products", path: `/${storeFrontID}/admin/products` },
  ];

  const determineHomePath = () => {
    if (routesRole === "admin") {
      return { label: storeFrontID, path: `/${storeFrontID}/admin` };
    }

    return { label: "Webpap", path: "/" };
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error === null) navigate("/login");
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
        <div className="lg:flex flex-row hidden ">
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
        <div className="lg:flex flex-row hidden ">
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

          <button
            onClick={handleLogOut}
            className={`px-5 py-1 rounded-md text-sm hover:bg-primary hover:text-white`}
          >
            {" "}
            Log out{" "}
          </button>
        </div>
      )}

      <Popover.Root
        defaultOpen={false}
        open={popoverOpen}
        onOpenChange={handlePopover}
      >
        <Popover.Trigger className="lg:hidden ">
          <MenuOutlined />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="flex flex-col bg-[#fff]  px-2 py-1 rounded-lg  mt-2.5 shadow-lg mr-2 ">
            {routesRole === "admin" && (
              <div>
                {adminRoutes.map(({ label, path }) => (
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
                <button
                  onClick={handleLogOut}
                  className={`px-5 py-1 w- rounded-md text-sm w-full text-center hover:bg-primary hover:text-white`}
                >
                  {" "}
                  Log out{" "}
                </button>
              </div>
            )}
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
