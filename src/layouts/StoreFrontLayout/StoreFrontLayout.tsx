import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import {
  MenuOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useGetRetailer } from "../../common/hooks";
import { Product } from "../../common/interfaces/index.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../supabase.ts";
import { useAppContext } from "../../contexts";
import { useQuery } from "react-query";

const SearchBar = () => {
  const { showToast } = useAppContext();
  const [name, setName] = useState("");
  const params = useParams();
  const storeFrontID = params.storeFrontID as string;
  const [open, setOpen] = useState(true);

  const fetchProduct = async () => {
    const {
      data,
      error,
    }: { data: Product[] | null; error: PostgrestError | null } = await supabase
      .from("products")
      .select()
      .eq("storeFrontId", storeFrontID)
      .eq("name", name);
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const productQuery = useQuery(["searchProduct", name], fetchProduct);

  const handleSearch = (e: any) => {
    setName(e.target.value);
  };

  const handleCloseOpen = () => {
    setName("");
    setOpen(false);
  };

  const handlePopover = () => {
    setOpen(!open);
  };

  return (
    <div className=" w-2/3 md:w-1/3 mx-auto  ">
      <Popover.Root
        defaultOpen={false}
        open={name !== ""}
        onOpenChange={handlePopover}
      >
        <Popover.Trigger className="w-full ">
          <input
            onChange={handleSearch}
            type="search"
            value={name}
            className="border outline-none rounded-full pl-2
          w-full "
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="flex flex-col bg-[#fff]
            rounded-lg  mt-4 shadow-lg mr-2  w-44 md:w-60 outline-none  "
          >
            {name !== "" &&
            productQuery?.data?.length !== undefined &&
            productQuery.data?.length > 0
              ? productQuery.data?.map(({ name, id, product_images }) => (
                  <Link
                    to={`/${storeFrontID}/product/${id}`}
                    onClick={handleCloseOpen}
                    className="flex flex-row items-center justify-between hover:bg-lightGrey
                     px-2 py-2 rounded-lg "
                  >
                    <img
                      src={product_images[0].url}
                      className="h-10 w-10 rounded-md  "
                    />{" "}
                    <p key={id}> {name} </p>
                    <RightOutlined />
                  </Link>
                ))
              : null}
            {name !== "" && productQuery.data?.length === 0 ? (
              <p className="text-center font-bold">No products found</p>
            ) : null}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/*{open && (*/}
      {/*  <div className="shadow-lg bg-primary mt-2  w-full absolute  ">*/}
      {/*    {name !== "" && productQuery.data?.length > 0*/}
      {/*      ? productQuery.data?.map(({ name, id }) => (*/}
      {/*          <Link*/}
      {/*            to={`/${storeFrontID}/product/${id}`}*/}
      {/*            onClick={handleCloseOpen}*/}
      {/*          >*/}
      {/*            <p key={id}> {name} </p>*/}
      {/*          </Link>*/}
      {/*        ))*/}
      {/*      : null}*/}
      {/*    {name !== "" && productQuery.data?.length === 0 ? (*/}
      {/*      <p className="text-center font-bold text-lg">No products found</p>*/}
      {/*    ) : null}*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export const StoreFrontLayout = () => {
  const { retailerError } = useGetRetailer();

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

  if (retailerError) return <Navigate to={"/404"} />;

  return (
    <>
      <div
        className="flex flex-row justify-between items-center pl-5 pr-5
      md:pr-4 h-10 md:h-12 sticky top-0 shadow-lg
        md:px-10 bg-white 
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

        <SearchBar />

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
    </>
  );
};
