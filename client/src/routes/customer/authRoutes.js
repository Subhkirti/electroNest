import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const ProductDetails = lazy(() =>
  import("../../modules/customer/components/productDetails/productDetails")
);
const Cart = lazy(() => import("../../modules/customer/components/cart/cart"));
const CheckoutStepper = lazy(() =>
  import("../../modules/customer/components/checkout/checkoutStepper")
);
const Order = lazy(() =>
  import("../../modules/customer/components/order/order")
);
const OrderDetails = lazy(() =>
  import("../../modules/customer/components/order/orderDetails")
);
const Product = lazy(() =>
  import("../../modules/customer/components/product/product")
);

const authRoutes = [
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
  {
    path: AppRoutes.productDetail,
    component: ProductDetails,
  },
  {
    path: AppRoutes.orders,
    component: Order,
  },
  {
    path: AppRoutes.orderDetail,
    component: OrderDetails,
  },
  {
    path: AppRoutes.cart,
    component: Cart,
  },
  {
    path: AppRoutes.checkout,
    component: CheckoutStepper,
  },
];

export default authRoutes;
