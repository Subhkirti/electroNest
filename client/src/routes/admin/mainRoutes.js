
import ProtectedRoutes from "../protectedRoutes";
import authLessRoutes from "./authLessRoutes";
import authRoutes from "./authRoutes";

function makeProtected(routes) {
  return routes.map((route) => ({
    path: route.path,
    component: () => <ProtectedRoutes Component={route.component} />,
  }));
}

const adminMainRoutes = [...authLessRoutes, ...makeProtected(authRoutes)];
export default adminMainRoutes;
