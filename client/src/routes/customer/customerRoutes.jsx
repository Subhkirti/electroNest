import { Route, Routes, useLocation } from "react-router-dom";
import AppRoutes from "../../common/appRoutes";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../modules/customer/components/navbar/navbar";
import Footer from "../../modules/customer/components/footer/footer";
import customerMainRoutes from "./mainRoutes";
import PageNotFound from "../../common/components/404Page";

function CustomerRoutes() {
  const location = useLocation();
  const homePaths = [AppRoutes.home, AppRoutes.login, AppRoutes.register];

  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          {customerMainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={ <route.component />}
            />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      {!homePaths.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default CustomerRoutes;
