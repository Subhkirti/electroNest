import authLessRoutes from "./authLessRoutes";
import authRoutes from "./authRoutes";
import ProtectedRoutes from "../protectedRoutes";

function makeProtected(routes) {
  return routes.map((route) => ({
    path: route.path,
    component: () => <ProtectedRoutes Component={route.component} />,
  }));
}

const customerMainRoutes = [...authLessRoutes, ...makeProtected(authRoutes)];
export default customerMainRoutes;
