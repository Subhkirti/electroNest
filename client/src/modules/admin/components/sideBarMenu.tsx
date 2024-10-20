import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminMenuItems } from "../utils/menuUtil";
import AppIcons from "../../../common/appIcons";
import packageJson from "../../../../package.json";
import { getCurrentUser } from "../../customer/utils/localStorageUtils";
import AdminAppRoutes from "../../../common/adminRoutes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/storeTypes";
import { logout } from "../../../store/customer/auth/action";

function SideBarMenu({ openDrawer }: { openDrawer: boolean }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = getCurrentUser();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();
  const currentVersion = packageJson.version;

  const drawer = (
    <Box className="overflow-auto flex flex-col justify-between">
      <List>
        {/* user details section */}
        <Link
          to={AdminAppRoutes.dashboard}
          className="flex flex-col items-center mb-6 space-y-3"
        >
          <Avatar
            src={AppIcons.imgAdminProfile}
            alt="profile"
            sx={{ width: 80, height: 80 }}
          />
          <Typography className="text-lg font-semibold">
            {user?.name}
          </Typography>
          <hr className="bg-lightpurple w-full h-[0.3px] opacity-40 border-none" />
        </Link>

        {/* menu lists */}
        {adminMenuItems.map((menuItem, index) => {
          const activeItem = location?.pathname === menuItem.path;
          return (
            menuItem.active && (
              <ListItem
                key={index}
                disablePadding
                onClick={
                  menuItem?.isLogout
                    ? () => dispatch(logout())
                    : () => navigate(menuItem.path)
                }
                className={
                  activeItem
                    ? "bg-lightpurple cursor-pointer"
                    : "cursor-pointer"
                }
              >
                <ListItemIcon className="py-4 px-6">
                  {<menuItem.icon className={"text-slate-50"} />}
                </ListItemIcon>

                <ListItemText>{menuItem.name}</ListItemText>
              </ListItem>
            )
          );
        })}

        {/* footer section */}
        <Box className="flex justify-center">
          <Box
            className="flex flex-col items-center fixed bottom-6 "
            style={{ left: openDrawer ? "50px" : "20px" }}
          >
            <img src={AppIcons.imgLogo} width={"140px"} alt="company logo" />
            <Typography className="text-xs text-slate-300">
              {openDrawer
                ? `Current version: ${currentVersion}`
                : `v${currentVersion}`}
            </Typography>
          </Box>
        </Box>
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
