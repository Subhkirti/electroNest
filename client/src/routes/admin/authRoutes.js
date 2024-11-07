import { lazy } from "react";

const AddCategory = lazy(() =>
  import("../../modules/admin/components/categories/addCategory")
);
const EditCategory = lazy(() =>
  import("../../modules/admin/components/categories/editCategory")
);
const AddProducts = lazy(() =>
  import("../../modules/admin/components/products/addProduct")
);
const ViewProduct = lazy(() =>
  import("../../modules/admin/components/products/viewProduct")
);
const EditProduct = lazy(() =>
  import("../../modules/admin/components/products/editProduct")
);
const EditUser = lazy(() =>
  import("../../modules/admin/components/users/editUser")
);
const Products = lazy(() =>
  import("../../modules/admin/components/products/products")
);
const Orders = lazy(() =>
  import("../../modules/admin/components/orders/orders")
);
const Customers = lazy(() =>
  import("../../modules/admin/components/customers/customers")
);
const Users = lazy(() => import("../../modules/admin/components/users/users"));
const AddUser = lazy(() =>
  import("../../modules/admin/components/users/addUser")
);
const ViewUser = lazy(() =>
  import("../../modules/admin/components/users/viewUser")
);
const Categories = lazy(() =>
  import("../../modules/admin/components/categories/categories")
);
const Dashboard = lazy(() =>
  import("../../modules/admin/components/dashboard/dashboard")
);

const authRoutes = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/product/add",
    component: AddProducts,
  },
  {
    path: "/products/view/:id",
    component: ViewProduct,
  },
  {
    path: "/products/edit/:id",
    component: EditProduct,
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
    path: "/categories",
    component: Categories,
  },
  {
    path: "/categories/add",
    component: AddCategory,
  },
  {
    path: "/categories/edit/:id",
    component: EditCategory,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/users/add",
    component: AddUser,
  },
  {
    path: "/users/view/:id",
    component: ViewUser,
  },
  {
    path: "/users/edit/:id",
    component: EditUser,
  },
];

export default authRoutes;
