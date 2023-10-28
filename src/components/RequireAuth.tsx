import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts";

export const RequireAuth = ({ children }: any) => {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
