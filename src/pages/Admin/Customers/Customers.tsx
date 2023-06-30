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
            {customers.map(({ name, phoneNumber, deliveryAddress }, index) => (
              <tr key={index} className=":">
                <td> {name} </td>
                <td> {phoneNumber} </td>
                <td> {deliveryAddress} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
