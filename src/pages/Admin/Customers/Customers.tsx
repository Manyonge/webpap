import { supabase } from "../../../supabase.ts";
import { Customer } from "../../../common/interfaces";
import { PostgrestError } from "@supabase/supabase-js";
import { useAppContext } from "../../../contexts/AppContext.tsx";
import { SeverityColorEnum } from "../../../common/enums";
import { useQuery } from "react-query";

const customers = [
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
  {
    name: "Arthur",
    phoneNumber: "072586134",
    deliveryAddress: "Shop direct, Jamhuri",
  },
];

export const Customers = () => {
  const { showToast } = useAppContext();
  const fetchCustomers = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    const {
      data,
      error,
    }: { data: Customer[] | null; error: PostgrestError | null } =
      await supabase
        .from("customers")
        .select()
        .eq("retailerId", sessionData.session?.user.id);

    if (error) {
      showToast(error.message, SeverityColorEnum.Error);
      throw new Error(error.message);
    }
    return data;
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
                  ({ name, phoneNumber, emailAddress }, index) => (
                    <tr key={index} className=":">
                      <td> {name} </td>
                      <td> {phoneNumber} </td>
                      <td> {emailAddress} </td>
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
