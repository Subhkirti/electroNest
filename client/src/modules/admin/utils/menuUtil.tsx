import { SvgIconTypeMap } from "@mui/material";
import {
  Category,
  Dashboard,
  Groups,
  LocalShipping,
} from "@mui/icons-material";
import AdminAppRoutes from "../../../common/adminRoutes";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface AdminMenuItem {
  name: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const adminMenuItems: AdminMenuItem[] = [
  {
    name: "Dashboard",
    path: AdminAppRoutes.dashboard,
    icon: Dashboard,
  },
  {
    name: "Products",
    path: AdminAppRoutes.products,
    icon: Category,
  },
  {
    name: "Customers",
    path: AdminAppRoutes.customers,
    icon: Groups,
  },
  {
    name: "Orders",
    path: AdminAppRoutes.orders,
    icon: LocalShipping,
  },
];

export { adminMenuItems };
