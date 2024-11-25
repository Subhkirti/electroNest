import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const Profile = lazy(() =>
  import("../../modules/customer/components/user/profile")
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

const authRoutes = [
  {
    path: AppRoutes.profile,
    component: Profile,
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
