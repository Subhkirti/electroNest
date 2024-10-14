import { lazy } from "react";

const Dashboard = lazy(() =>
  import("../../modules/admin/components/dashboard/dashboard")
);

const authLessRoutes = [
  {
    path: "/",
    component: Dashboard,
  },
];

export default authLessRoutes;
