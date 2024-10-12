import authLessRoutes from "./customer/authLessRoutes";
import authRoutes from "./customer/authRoutes";
import ProtectedRoutes from "./protectedRoutes";

function makeProtected(routes) {
  return routes.map((route) => ({
    path: route.path,
    component: () => <ProtectedRoutes Component={route.component} />,
  }));
}

const mainRoutes = [...authLessRoutes, ...makeProtected(authRoutes)];
export default mainRoutes;
