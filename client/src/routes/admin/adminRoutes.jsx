import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import adminMainRoutes from "./mainRoutes";
import NotFound from "../../common/notFound";
import SideBarMenu from "../../modules/admin/components/sideBarMenu";

function AdminRoutes() {
  return (
    <div>
      <ToastContainer />
      <div className="admin-container">
        <Routes>
          {adminMainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <SideBarMenu>
                  <route.component />
                </SideBarMenu>
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminRoutes;
