import { Link, useParams } from "react-router-dom";
import { useGetRetailer, useLoadingImage } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useQuery } from "react-query";
import { useAppContext } from "../../../contexts";
import { useEffect } from "react";

export const AdminDashboard = () => {
  useLoadingImage();
  const { supabaseFetcher } = useAppContext();
  const { retailer } = useGetRetailer();
  const { storeFrontId } = useParams();

  const fetchStats = async () => {
    const sessionData = await supabaseFetcher(supabase.auth.getSession());

    const revenue = await supabaseFetcher(
      supabase
        .from("retailers")
        .select("wallet_balance")
        .eq("id", sessionData.session?.user.id)
        .single(),
    );

    const products = await supabaseFetcher(
      supabase
        .from("products")
        .select()
        .eq("retailer_id", sessionData.session?.user.id),
    );
    const orders = await supabaseFetcher(
      supabase
        .from("orders")
        .select()
        .eq("retailer_id", sessionData.session?.user.id),
    );

    const customers = await supabaseFetcher(
      supabase
        .from("customers")
        .select()
        .eq("retailer_id", sessionData.session?.user.id),
    );

    return { revenue, products, orders, customers };
  };

  useEffect(() => {}, []);

  const statsQuery = useQuery("stats", fetchStats);

  const currentStats = [
    {
      label: "Revenue",
      value: statsQuery.data?.revenue?.wallet_balance.toLocaleString(),
      info: "Sales you've made so far",
      route: "wallet",
    },
    {
      label: "Products",
      value: statsQuery.data?.products?.length,
      info: "Manage your products",
      route: "products",
    },
    {
      label: "Orders",
      value: statsQuery.data?.orders?.length,
      info: "Manage your orders",
      route: "orders",
    },
    {
      label: "Customers",
      value: statsQuery.data?.customers?.length,
      info: " customers you've served so far",
      route: "customers",
    },
  ];

  return (
    <>
      <div
        className="pulse-loading  mx-auto my-7
       rounded-full"
      >
        <img
          src={retailer?.business_logo as string}
          alt={`${storeFrontId} business logo`}
          loading="eager"
          className=" w-28 h-28 loading-image
        md:w-32 md:h-32 rounded-full opacity-0
        "
        />
      </div>

      <p className="text-center font-bold mb-4 text-lg md:text-xl">
        Here's your progress so far
      </p>

      <div className="px-4 mx-auto md:w-10/12 grid grid-cols-2 gap-6 md:gap-10  ">
        {currentStats.map(({ label, value, info, route }, index) => (
          <Link to={route} key={index}>
            <div className="rounded-lg shadow-lg hover:shadow-xl h-40">
              <div
                className="bg-primary text-[#fff] h-3/5 md:h-3/4
              rounded-tr-lg rounded-tl-lg pt-4 "
              >
                {value === undefined && (
                  <p className="text-[#fff] text-center text-3xl md:text-6xl font-bold ">
                    ...
                  </p>
                )}
                {statsQuery.isSuccess && (
                  <p className="text-[#fff] text-center text-3xl md:text-6xl font-bold ">
                    {" "}
                    {value}{" "}
                  </p>
                )}
                <p className="text-[#fff] text-center text-lg md:text-xl font-bold ">
                  {" "}
                  {label}{" "}
                </p>
              </div>
              <div className=" flex flex-col items-center justify-center pt-1 ">
                {" "}
                <p className="text-center text-sm px-2 "> {info} </p>{" "}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
