import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const HomeScreen = lazy(() =>
  import("../../modules/customer/components/home/homeScreen")
);
const Product = lazy(() =>
  import("../../modules/customer/components/product/product")
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
    component: Product,
  },
  {
    path: AppRoutes.secondLevelProduct,
    component: Product,
  },
  {
    path: AppRoutes.firstLevelProduct,
    component: Product,
  },
  {
    path: AppRoutes.products,
    component: Product,
  },
];

export default authLessRoutes;
