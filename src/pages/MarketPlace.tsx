import { Navbar, WebpapFooter } from "../components";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "react-query";
import { Retailer } from "../common/interfaces";
import { supabase } from "../supabase.ts";

const RetailerPaper = (props: {
  imageURL: string;
  description: string;
  storeFrontID: string;
}) => {
  const { storeFrontID, description, imageURL } = props;
  return (
    <Link to={`/${storeFrontID}`} className={"Link"}>
      <div className=" w-full md:w-60 shadow-md rounded-lg mx-auto  ">
        <img
          src={imageURL}
          className="w-40 md:w-60 h-36 md:h-48 rounded-lg object-cover "
        />

        <p className="text-center text-sm md:text-base/5 my-3 font-bold pb-3 ">
          {" "}
          {description}{" "}
        </p>
      </div>
    </Link>
  );
};

export const MarketPlace = () => {
  const { showToast } = useAppContext();
  const fetchRetailers = async () => {
    const {
      data,
      error,
    }: { data: null | Retailer[]; error: null | PostgrestError } =
      await supabase.from("retailers").select();
    if (error) {
      showToast(error.message);
      throw new Error(error.message);
    }
    return data;
  };

  const retailersQuery = useQuery("retailers", fetchRetailers);

  return (
    <>
      <Navbar routesRole="app" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 pt-4 px-3 md:px-4 pb-40 mb-96">
        {retailersQuery.data?.map(({ business_logo, business_name }, index) => (
          <RetailerPaper
            key={index}
            imageURL={business_logo as string}
            description={business_name}
            storeFrontID={business_name}
          />
        ))}
      </div>

      <WebpapFooter />
    </>
  );
};
