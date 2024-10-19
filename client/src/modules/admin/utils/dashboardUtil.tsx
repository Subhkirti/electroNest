import {
  AccountCircle,
  AttachMoney,
  SettingsCell,
  TrendingUp,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import AppColors from "../../../common/appColors";

interface SalesDataItem {
  stats: string;
  title: string;
  color: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const salesData: SalesDataItem[] = [
  {
    stats: "245K",
    title: "Sales",
    color: AppColors.yellow,
    icon: TrendingUp,
  },

  {
    stats: "12.5K",
    title: "Customers",
    color: AppColors.green,
    icon: AccountCircle,
  },

  {
    stats: "15.45K",
    title: "Products",
    color: AppColors.red,
    icon: SettingsCell,
  },
  {
    stats: "88K",
    title: "Revenue",
    color: AppColors.blue,
    icon: AttachMoney,
  },
];

export { salesData };
