import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const HomeScreen = lazy(() =>
  import("../../modules/customer/components/home/homeScreen")
);

const authLessRoutes = [
  {
    path: AppRoutes.home,
    component: HomeScreen,
  },
  {
    path: AppRoutes.login,
    component: HomeScreen,
  },
  {
    path: AppRoutes.register,
    component: HomeScreen,
  },
];

export default authLessRoutes;
