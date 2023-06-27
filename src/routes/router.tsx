import {createBrowserRouter} from "react-router-dom";
import {AppLayout} from "../layouts";
import {NotFound} from "../pages";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        errorElement: <NotFound/>
    }
])