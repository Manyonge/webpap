import { Order } from "../../../common/interfaces";
import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { useQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { stringToDate } from "../../../common/utils";
import { SeverityColorEnum } from "../../../common/enums";

export const SingleOrder = () => {
  const params = useParams();
  const orderID = params.orderID as string;
  const storeFrontID = params.storeFrontID as string;
  const { showToast } = useAppContext();
  const fetchOrder = async () => {
    const {
      data,
      error,
    }: { data: null | Order; error: null | PostgrestError } = await supabase
      .from("orders")
      .select()
      .order("created_at", { ascending: false })
      .eq("id", orderID)
      .single();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const orderQuery = useQuery("order", fetchOrder);

  const navigate = useNavigate();
  const handleEditOrder = async () => {
    const { error } = await supabase
      .from("orders")
      .update({ isFulfilled: true })
      .eq("id", orderQuery.data?.id);
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    showToast("Order fulfilled!", SeverityColorEnum.Success);
    navigate(`/${storeFrontID}/admin/orders`);
  };

  return (
    <div className="px-10 md:px-44 pt-10 ">
      <Link to={`/${storeFrontID}/admin/orders`}>
        <button className="flex flex-row items-center justify-center mb-4">
          {" "}
          <LeftOutlined />
          Back{" "}
        </button>
      </Link>
      <div className=" py-4 rounded-lg shadow-lg text-center ">
        <img
          src={orderQuery.data?.product.productImages[0].url}
          className="rounded-lg h-44 w-44 mx-auto "
        />
        <p> {orderQuery.data?.product.name} </p>
        <p> {orderQuery.data?.product.price} </p>
        <p>
          {" "}
          Ordered at{" "}
          {stringToDate(
            orderQuery.data?.created_at as string,
          ).toDateString()}{" "}
        </p>
      </div>

      {!orderQuery.data?.isFulfilled && (
        <button
          onClick={handleEditOrder}
          className="  shadow-lg rounded-full mt-10 w-full text-[#fff] bg-[#416C85]"
        >
          Fulfill
        </button>
      )}

      {orderQuery.data?.isFulfilled && (
        <p
          className="mt-10 w-full text-lg font-bold
         text-center text-success flex flex-row items-center justify-center"
        >
          Order fulfilled
          <CheckOutlined className="ml-4" />
        </p>
      )}
    </div>
  );
};
