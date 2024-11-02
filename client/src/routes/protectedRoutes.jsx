import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../modules/customer/utils/localStorageUtils";

function ProtectedRoutes(props) {
  const { Component, isAdmin } = props;
  const user = getCurrentUser();

  if (!user || (isAdmin && user && user?.role !== "admin")) {
    return <Navigate to="/" />;
  }
  return <Component />;
}

export default ProtectedRoutes;
