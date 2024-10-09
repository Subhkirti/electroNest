import { Navigate, Route, Routes } from "react-router-dom";
import AppRoutes from "../../common/appRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mainRoutes from "../mainRoutes";
import Navbar from "../../modules/customer/components/navbar/navbar";
import Footer from "../../modules/customer/components/footer/footer";

function CustomerRoutes() {
  const homePaths = [AppRoutes.home, AppRoutes.login, AppRoutes.register];

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="container">
        <Routes>
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to={AppRoutes.notFound} replace />}
          />
        </Routes>
      </div>

      {!homePaths.includes(window.location.pathname) && <Footer />}
    </div>
  );
}

export default CustomerRoutes;
