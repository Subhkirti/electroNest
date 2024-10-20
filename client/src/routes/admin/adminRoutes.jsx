import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import adminMainRoutes from "./mainRoutes";
import NotFound from "../../common/components/notFound";
import SideBarMenu from "../../modules/admin/components/sideBarMenu";
import { Collapse, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import Header from "../../modules/admin/components/header/header";

function AdminRoutes() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [openDrawer, setOpenDrawer] = useState(isLargeScreen ? true : false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const menuLeftSpace = openDrawer ? "16%" : "0";
  
  return (
    <div>
      <ToastContainer />
      <Header leftSpace={menuLeftSpace} />
      <div className="admin-container">
        {renderSideBar()}
        <Routes>
          {adminMainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <div
                  className={`w-full p-10 pr-0 `}
                  style={{ paddingLeft: menuLeftSpace }}
                >
                  {
                    <Collapse in={true} orientation="horizontal">
                      <route.component />
                    </Collapse>
                  }
                </div>
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );

  function renderSideBar() {
    return (
      <div
        className="absolute border-l-2 px-2 border-lightpurple h-screen"
        style={{
          width: openDrawer ? "14%" : "1%",
        }}
      >
        <Tooltip
          title={openDrawer ? "Collapse" : "Expand"}
          onMouseEnter={() => setOpenTooltip(true)}
          onMouseLeave={() => setOpenTooltip(false)}
          open={openTooltip}
        >
          <div
            className="absolute top-10 p-0 rounded-3xl bg-lightpurple"
            style={{
              zIndex: 99999,
              right: 0,
            }}
            onClick={() => {
              setOpenDrawer(!openDrawer);
              setOpenTooltip(false);
            }}
          >
            {openDrawer ? (
              <ArrowLeft
                className="text-slate-300 cursor-pointer"
                fontSize="large"
              />
            ) : (
              <ArrowRight
                className="text-slate-300 cursor-pointer"
                fontSize="large"
              />
            )}
          </div>
        </Tooltip>
        <SideBarMenu openDrawer={openDrawer} />
      </div>
    );
  }
}

export default AdminRoutes;
