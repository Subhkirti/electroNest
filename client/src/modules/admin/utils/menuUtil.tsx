import { SvgIconTypeMap } from "@mui/material";
import {
  Category,
  Dashboard,
  Group,
  Groups2,
  LocalShipping,
  Logout,
  ViewList,
} from "@mui/icons-material";
import AdminAppRoutes from "../../../common/adminRoutes";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { getCurrentUser } from "../../customer/utils/localStorageUtils";

interface AdminMenuItem {
  name: string;
  path: string | null;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  isLogout?: boolean;
  active: boolean;
}

const user = getCurrentUser();
const adminMenuItems: AdminMenuItem[] = [
  {
    name: "Dashboard",
    path: AdminAppRoutes.dashboard,
    icon: Dashboard,
    active: true,
  },
  {
    name: "Products",
    path: AdminAppRoutes.products,
    icon: Category,
    active: true,
  },
  {
    name: "Users",
    path: AdminAppRoutes.users,
    icon: Groups2,
    active: true,
  },
  // {
  //   name: "Customers",
  //   path: AdminAppRoutes.customers,
  //   icon: Group,
  //   active: true,
  // },
  {
    name: "Orders",
    path: AdminAppRoutes.orders,
    icon: LocalShipping,
    active: true,
  },
  {
    name: "Categories",
    path: AdminAppRoutes.categories,
    icon: ViewList,
    active: true,
  },

  {
    name: "Logout",
    path: null,
    icon: Logout,
    isLogout: true,
    active: user ? true : false,
  },
];

export { adminMenuItems };
