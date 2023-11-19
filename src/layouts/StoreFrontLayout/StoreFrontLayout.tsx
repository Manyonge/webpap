import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { LoadingIndicator, ProductSearch } from "../../components";
import { useAppContext } from "../../contexts";
import { SeverityColorEnum } from "../../common/enums";
import { supabase } from "../../supabase.ts";

export const StoreFrontLayout = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { storeFrontId } = useParams();
  const { pathname } = useLocation();
  const { supabaseFetcher, showToast } = useAppContext();
  const navigate = useNavigate();
  const [verifyLoading, setVerifyLoading] = useState(true);

  const routes = [
    { label: "Home", path: `/${storeFrontId}` },
    { label: "Shopping Cart", path: `/${storeFrontId}/shopping-cart` },
  ];

  useEffect(() => {
    const verifyStoreId = async () => {
      try {
        await supabaseFetcher(
          supabase
            .from("retailers")
            .select()
            .eq("business_name", storeFrontId)
            .single(),
        );
        setVerifyLoading(false);
      } catch (e: any) {
        showToast(
          "The Store you requested does not exist",
          SeverityColorEnum.Error,
        );
        navigate("/market-place");
        throw e;
      }
    };
    verifyStoreId().then();
  }, [storeFrontId]);

  const handlePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  if (verifyLoading)
    return (
      <LoadingIndicator
        heightWidthXs={30}
        heightWidthMd={40}
        styleClasses="mt-40"
        fillColor="fill-black"
      />
    );

  return (
    <>
      <div
        className="flex flex-row justify-between items-center pl-5 pr-5
      md:pr-4 h-10 md:h-12 sticky top-0 shadow-lg
        md:px-10 bg-white  z-50
        "
      >
        <Link
          to={`/${storeFrontId}`}
          className="hidden md:block text-xl capitalize"
        >
          {" "}
          {`${storeFrontId}`}{" "}
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
            rounded-lg  mt-2.5 shadow-lg mr-2 outline-none "
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

        <ProductSearch
          resultRoute={`/${storeFrontId}/product/`}
          widthClass="w-3/4 md:w-1/2"
        />

        <div className="hidden md:block">
          {routes.map(({ label, path }) => (
            <Link to={path} key={path}>
              <button
                className={`px-5 py-1 inline rounded-md text-sm  ${
                  pathname === path ? "btn-primary" : ""
                }`}
              >
                {label}
              </button>
            </Link>
          ))}
        </div>

        <Link to={`/${storeFrontId}/shopping-cart`} className="md:hidden">
          <ShoppingCartOutlined className="text-" />
        </Link>
      </div>

      <Outlet />
    </>
  );
};
