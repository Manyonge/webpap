import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { stringToDate } from "../../../common/utils";
import { SeverityColorEnum } from "../../../common/enums";

export const SingleOrder = () => {
  const { orderId, storeFrontId } = useParams();
  const { showToast, supabaseFetcher } = useAppContext();
  const fetchOrder = async () => {
    return await supabaseFetcher(
      supabase
        .from("orders")
        .select()
        .order("created_at", { ascending: false })
        .eq("id", orderId)
        .single(),
    );
  };

  const orderQuery = useQuery(["order", orderId], fetchOrder);

  const navigate = useNavigate();
  const handleEditOrder = async () => {
    await supabaseFetcher(
      supabase
        .from("orders")
        .update({ is_fulfilled: true })
        .eq("id", orderQuery.data?.id),
    );

    showToast("Order fulfilled!", SeverityColorEnum.Success);
    navigate(`/${storeFrontId}/admin/orders`);
  };

  return (
    <div className="px-10 md:px-44 pt-10 ">
      <Link to={`/${storeFrontId}/admin/orders`}>
        <button
          className="flex flex-row items-center
         justify-center mb-4"
        >
          {" "}
          <LeftOutlined />
          Back{" "}
        </button>
      </Link>
      <div
        className=" py-4 rounded-lg
      shadow-lg text-center "
      >
        <img
          src={orderQuery.data?.product.product_images[0].url}
          className="rounded-lg h-44 w-44 mx-auto "
        />
        <p> {orderQuery.data?.product.name} </p>
        <p> {`${orderQuery.data?.product.price} KSH`} </p>
        <p>
          {" "}
          Ordered at{" "}
          {stringToDate(
            orderQuery.data?.created_at as string,
          ).toLocaleString()}{" "}
        </p>
      </div>

      {!orderQuery.data?.is_fulfilled && (
        <button
          onClick={handleEditOrder}
          className="  shadow-lg rounded-full mt-10 w-full
           text-[#fff] bg-[#416C85]"
        >
          Fulfill
        </button>
      )}

      {orderQuery.data?.is_fulfilled && (
        <p
          className="mt-10 w-full text-lg font-bold
         text-center text-success flex flex-row
          items-center justify-center"
        >
          Order fulfilled
          <CheckOutlined className="ml-4" />
        </p>
      )}
    </div>
  );
};
