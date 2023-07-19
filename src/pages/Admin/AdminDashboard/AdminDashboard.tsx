import { Link } from "react-router-dom";
import { useGetRetailer } from "../../../common/hooks";
import { supabase } from "../../../supabase.ts";
import { useQuery } from "react-query";

export const AdminDashboard = () => {
  const { retailer } = useGetRetailer();

  const fetchStats = async () => {
    const stats = { revenue: 0, products: 0, orders: 0, customers: 0 };
    const { data: sessionData } = await supabase.auth.getSession();

    const { data: revenue } = await supabase
      .from("retailers")
      .select("walletBalance")
      .eq("id", sessionData.session?.user.id)
      .single();
    revenue ? (stats.revenue = revenue.walletBalance) : null;

    const { data: totalProducts } = await supabase.from("products").select();
    totalProducts ? (stats.products = totalProducts.length) : null;

    const { data: orders } = await supabase.from("orders").select();
    orders ? (stats.orders = orders.length) : null;

    const { data: customers } = await supabase.from("customers").select();
    customers ? (stats.customers = customers.length) : null;

    return stats;
  };

  const statsQuery = useQuery("stats", fetchStats);

  const currentStats = [
    {
      label: "Revenue",
      value: statsQuery.data?.revenue.toLocaleString(),
      info: "Sales you've made so far",
      route: "wallet",
    },
    {
      label: "Products",
      value: statsQuery.data?.products,
      info: "Manage your products",
      route: "products",
    },
    {
      label: "Orders",
      value: statsQuery.data?.orders,
      info: "Manage your orders",
      route: "orders",
    },
    {
      label: "Customers",
      value: statsQuery.data?.customers,
      info: " customers you've served so far",
      route: "customers",
    },
  ];

  return (
    <>
      <img
        src={retailer?.businessLogo as string}
        alt="your business logo"
        className="mx-auto my-7 w-28 h-28 md:w-32 md:h-32 rounded-full
        text-center
        "
      />

      <p className="text-center font-bold mb-4 text-lg md:text-xl">
        Here's your progress so far
      </p>

      <div className="px-4 mx-auto md:w-10/12 grid grid-cols-2 gap-6 md:gap-10  ">
        {currentStats.map(({ label, value, info, route }, index) => (
          <Link to={route} key={index}>
            <div className="rounded-lg shadow-lg hover:shadow-xl h-40 ">
              <div className="bg-primary text-[#fff] h-3/5 md:h-3/4 rounded-tr-lg rounded-tl-lg py-4 ">
                <p className="text-[#fff] text-center text-3xl md:text-6xl font-bold ">
                  {" "}
                  {value}{" "}
                </p>
                <p className="text-[#fff] text-center text-lg md:text-xl font-bold ">
                  {" "}
                  {label}{" "}
                </p>
              </div>
              <div className="h-1/4">
                {" "}
                <p className="text-center text-sm px-2 py-1"> {info} </p>{" "}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
