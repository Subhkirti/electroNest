import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const Cart = lazy(() => import("../../modules/customer/components/cart/cart"));

const HomeScreen = lazy(() =>
  import("../../modules/customer/components/home/homeScreen")
);
const ProductFilters = lazy(() =>
  import("../../modules/customer/components/product/productFilters")
);
const ProductDetails = lazy(() =>
  import("../../modules/customer/components/productDetails/productDetails")
);

const authLessRoutes = [
  {
    path: AppRoutes.home,
    component: HomeScreen,
  },
  {
    path: AppRoutes.cart,
    component: Cart,
  },
  {
    path: AppRoutes.productDetail,
    component: ProductDetails,
  },
  {
    path: AppRoutes.login,
    component: HomeScreen,
  },
  {
    path: AppRoutes.register,
    component: HomeScreen,
  },
  {
    path: AppRoutes.thirdLevelProduct,
    component: ProductFilters,
  },
  {
    path: AppRoutes.secondLevelProduct,
    component: ProductFilters,
  },
  {
    path: AppRoutes.firstLevelProduct,
    component: ProductFilters,
  },
  {
    path: AppRoutes.products,
    component: ProductFilters,
  },
];

export default authLessRoutes;
