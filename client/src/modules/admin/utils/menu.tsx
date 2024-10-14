import { SvgIconProps } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import AdminAppRoutes from "../../../common/adminRoutes";

interface AdminMenuItem {
  name: string;
  path: string;
  icon: React.ReactElement<SvgIconProps>;
}
const adminMenuItems: AdminMenuItem[] = [
  {
    name: "Dashboard",
    path: AdminAppRoutes.dashboard,
    icon: <Dashboard />,
  },
  { name: "Products", path: AdminAppRoutes.products,  icon:<Dashboard /> },
  { name: "Customers", path: AdminAppRoutes.customers,  icon: <Dashboard /> },
  { name: "Orders", path: AdminAppRoutes.orders,  icon: <Dashboard />},
  { name: "Add Product", path: AdminAppRoutes.addProduct,  icon: <Dashboard /> },
];

export { adminMenuItems };
