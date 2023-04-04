import { useLocation,Navigate,Outlet } from "react-router-dom";
import useAuth from "../realm/useAuth";

const StateMiddleware = () => {

    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ?<Outlet />
            :<Navigate to="/login"/>
    );
}

export default StateMiddleware;