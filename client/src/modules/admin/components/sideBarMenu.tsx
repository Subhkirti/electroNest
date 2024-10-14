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
import { useNavigate } from "react-router-dom";
import { adminMenuItems } from "../utils/menu";

function SideBarMenu({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const drawer = (
    <Box className="overflow-auto flex flex-col justify-between">
      {isLargeScreen && <Toolbar></Toolbar>}

      <List>
        {adminMenuItems.map((menuItem, index) => {
          return (
            <ListItem
              key={index}
              disablePadding
              onClick={() => navigate(menuItem.path)}
            >
              <ListItemButton alignItems="flex-start">
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
              </ListItemButton>
              <ListItemText className="cursor-pointer">
                {menuItem.name}
              </ListItemText>
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
          variant="permanent"
          sx={{
            width: 440,
            flexShrink: 1,
          }}
          classes={{ paper: "w-[20%]" }}
        >
          {drawer}
        </Drawer>

        <div className="w-full">{children}</div>
      </Box>
    </div>
  );
}

export default SideBarMenu;
