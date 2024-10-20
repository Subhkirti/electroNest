import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { adminMenuItems } from "../utils/menuUtil";
import AppIcons from "../../../common/appIcons";
import packageJson from "../../../../package.json";
import { ArrowLeft, ArrowRight, BorderLeft } from "@mui/icons-material";
import { useState } from "react";

function SideBarMenu({ openDrawer }: { openDrawer: boolean }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();
  const currentVersion = packageJson.version;

  const drawer = (
    <Box className="overflow-auto flex flex-col justify-between">
      <List>
        {adminMenuItems.map((menuItem, index) => {
          const activeItem = location?.pathname === menuItem.path;
          return (
            <ListItem
              key={index}
              disablePadding
              onClick={() => navigate(menuItem.path)}
              className={
                activeItem ? "bg-lightpurple cursor-pointer" : "cursor-pointer"
              }
            >
              <ListItemIcon className="py-4 px-6">
                {<menuItem.icon className={"text-slate-50"} />}
              </ListItemIcon>

              <ListItemText>{menuItem.name}</ListItemText>
            </ListItem>
          );
        })}
        <ListItemIcon style={{ width: "100%" }} className="fixed bottom-0 ">
          <Box style={{ left: openDrawer ? "50px" : "20px" }}>
            <img src={AppIcons.imgLogo} width={"100px"} alt="mm logo" />
            <Typography sx={{ fontSize: "10px" }} className=" text-lightpurple">
              {openDrawer
                ? `Current version: ${currentVersion}`
                : `v${currentVersion}`}
            </Typography>
          </Box>
        </ListItemIcon>
      </List>
    </Box>
  );

  return (
    <div>
      <Box sx={{ display: isLargeScreen ? "flex" : "block" }}>
        <CssBaseline />
        <Drawer
          open={openDrawer}
          variant="persistent"
          sx={{
            width: "16%",
            flexShrink: 1,
          }}
          classes={{ paper: "drawer-paper" }}
        >
          {drawer}
        </Drawer>
      </Box>
    </div>
  );
}

export default SideBarMenu;
