import {
  AccountCircle,
  AttachMoney,
  SettingsCell,
  TrendingUp,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

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
    color: "#eab500",
    icon: TrendingUp,
  },

  {
    stats: "12.5K",
    title: "Customers",
    color: "#21d266",
    icon: AccountCircle,
  },

  {
    stats: "15.45K",
    title: "Products",
    color: "#e05240",
    icon: SettingsCell,
  },
  {
    stats: "88K",
    title: "Revenue",
    color: "#0ebaeb",
    icon: AttachMoney,
  },
];

export { salesData };
