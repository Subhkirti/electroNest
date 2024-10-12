import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../modules/customer/utils/localStorageUtils";

function ProtectedRoutes(props) {
  const { Component } = props;
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <Component />;
}

export default ProtectedRoutes;