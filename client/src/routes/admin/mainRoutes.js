import ProtectedRoutes from "../protectedRoutes";
import authRoutes from "./authRoutes";

function makeProtected(routes) {
  return routes.map((route) => ({
    path: route.path,
    component: () => (
      <ProtectedRoutes Component={route.component} isAdmin={true} />
    ),
  }));
}

const adminMainRoutes = [...makeProtected(authRoutes)];
export default adminMainRoutes;
