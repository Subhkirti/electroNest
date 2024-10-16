import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { adminMenuItems } from "../utils/menuUtil";

function SideBarMenu({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();

  const drawer = (
    <Box className="overflow-auto flex flex-col justify-between">
      {isLargeScreen && <Toolbar></Toolbar>}

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
      </List>
    </Box>
  );

  return (
    <div>
      <Box sx={{ display: isLargeScreen ? "flex" : "block" }}>
        <CssBaseline />

        <Drawer
          variant={isLargeScreen ? "permanent" : "temporary"}
          sx={{
            width: "16%",
            flexShrink: 1,
          }}
          classes={{ paper: "drawer-paper" }}
        >
          {drawer}
        </Drawer>

        <div className="w-full p-10 pr-0">{children}</div>
      </Box>
    </div>
  );
}

export default SideBarMenu;
