import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../../components";
import { useGetRetailer } from "../../common/hooks";

export const AdminLayout = () => {
  const { retailerError } = useGetRetailer();

  if (retailerError) return <Navigate to={"/404"} />;
  return (
    <>
      <Navbar routesRole={"admin"} />
      <Outlet />
    </>
  );
};
