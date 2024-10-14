import { lazy } from "react";

const AddProducts = lazy(() =>
  import("../../modules/admin/components/addProduct/addProduct")
);
const Products = lazy(() => import("../../modules/admin/components/products/products"));
const Orders = lazy(() => import("../../modules/admin/components/orders/orders"));
const Customers = lazy(() =>
  import("../../modules/admin/components/customers/customers")
);

const authRoutes = [
  {
    path: "/product/add",
    component: AddProducts,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/customers",
    component: Customers,
  },
];

export default authRoutes;
