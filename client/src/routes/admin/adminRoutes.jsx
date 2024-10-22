import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import adminMainRoutes from "./mainRoutes";
import NotFound from "../../common/components/notFound";
import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Header from "../../modules/admin/components/header/header";
import SideBarMenu from "../../modules/admin/components/sideBarMenu";

function AdminRoutes() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [openDrawer, setOpenDrawer] = useState(isLargeScreen ? true : false);
  const menuLeftSpace = openDrawer ? "16%" : "0";

  return (
    <div>
      <ToastContainer />
      <Header isMenuDrawerOpen={openDrawer} />
      <SideBarMenu openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <div className="admin-container">
        <Routes>
          {adminMainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <div
                  className="py-10"
                  style={{ marginLeft: menuLeftSpace }}
                >
                  {<route.component />}
                </div>
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
