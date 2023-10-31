import { supabase } from "../../../supabase.ts";
import { useAppContext } from "../../../contexts/";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Customer } from "../../../common/interfaces";

export const Customers = () => {
  const { supabaseFetcher } = useAppContext();
  const params = useParams();
  const storeFrontId = params.storeFrontId;
  const fetchCustomers = async (): Promise<Customer[]> => {
    return await supabaseFetcher(
      supabase.from("customers").select().eq("storefront_id", storeFrontId),
    );
  };

  const customersQuery = useQuery("customers", fetchCustomers);

  return (
    <>
      <p className="text-center font-bold text-lg md:text-xl leading-5 md:leading-5 my-6">
        Customers you've <br /> served so far
      </p>

      <div className="w-full  overflow-x-auto px-2 md:w-10/12 mx-auto ">
        <table className=" w-96 md:w-full  ">
          <thead>
            <tr>
              <th> Name </th>
              <th> Phone Number </th>
              <th> Delivery Address </th>
            </tr>
          </thead>

          <tbody>
            {customersQuery.data !== undefined &&
            customersQuery.data !== null &&
            customersQuery.data.length > 0
              ? customersQuery.data.map(
                  (
                    {
                      name,
                      phone_number: phone_number,
                      email_address: email_address,
                    },
                    index,
                  ) => (
                    <tr key={index} className=":">
                      <td> {name} </td>
                      <td> {phone_number} </td>
                      <td> {email_address} </td>
                    </tr>
                  ),
                )
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};
