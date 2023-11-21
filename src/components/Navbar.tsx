import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { supabase } from "../supabase.ts";

export const Navbar = (props: { routesRole: "app" | "admin" }) => {
  const { routesRole } = props;
  const { pathname } = useLocation();
  const { storeFrontId } = useParams();
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
      label: "pricing",
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
    { label: "customers", path: `/${storeFrontId}/admin/customers` },
    { label: "orders", path: `/${storeFrontId}/admin/orders` },
    { label: "store front", path: `/${storeFrontId}/` },
    { label: "wallet", path: `/${storeFrontId}/admin/wallet` },
    { label: "products", path: `/${storeFrontId}/admin/products` },
  ];

  const determineHomePath = () => {
    if (routesRole === "admin") {
      return { label: storeFrontId, path: `/${storeFrontId}/admin` };
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
     bg-white h-10 md:h-12 sticky top-0 shadow-lg z-50"
    >
      <Link
        to={determineHomePath().path}
        className=" font-medium text-lg capitalize "
      >
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
          <Link to={`/${storeFrontId}/admin`}>
            <button
              className={`px-5 py-1 rounded-md text-sm  ${
                pathname === `/${storeFrontId}/admin` ? "btn-primary" : ""
              }`}
            >
              Dashboard
            </button>
          </Link>
          {adminRoutes.map(({ label, path }) => (
            <Link to={path} key={path}>
              <button
                className={`px-5 py-1 rounded-md text-sm capitalize ${
                  pathname.includes(label) ? "btn-primary" : ""
                }`}
              >
                {label}
              </button>
            </Link>
          ))}

          <button
            onClick={handleLogOut}
            className={`px-5 py-0.5 rounded-md text-sm hover:bg-error hover:text-white`}
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
        <Popover.Trigger className="lg:hidden  ">
          <MenuOutlined />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="flex flex-col bg-[#fff]  px-2 py-1 rounded-lg
            outline-none mt-2.5 shadow-lg mr-2 "
          >
            {routesRole === "admin" && (
              <div>
                <Link to={`/${storeFrontId}/admin`}>
                  <button
                    onClick={handlePopover}
                    className={`px-5 py-1 rounded-md text-sm  ${
                      pathname === `/${storeFrontId}/admin` ? "btn-primary" : ""
                    }`}
                  >
                    Dashboard
                  </button>
                </Link>
                {adminRoutes.map(({ label, path }) => (
                  <Link to={path} key={path}>
                    <div
                      onClick={handlePopover}
                      className={`px-5 py-1 w- rounded-md text-sm w-full text-center  ${
                        pathname.includes(label) ? "btn-primary" : ""
                      }`}
                    >
                      {label}
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleLogOut}
                  className={`px-5 py-1 capitalize rounded-md text-sm w-full text-center hover:bg-error hover:text-white`}
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
