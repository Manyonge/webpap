import {Outlet} from "react-router-dom";
import {Navbar} from "../../components";

export const AdminLayout = () => {

    return (
        <>
        <Navbar routesRole={"admin"}/>
            <Outlet/>
        </>
    )
}