import { lazy } from "react";
import AppRoutes from "../../common/appRoutes";

const Profile = lazy(() =>
  import("../../modules/customer/components/user/profile")
);
const CheckoutStepper = lazy(() =>
  import("../../modules/customer/components/checkout/checkoutStepper")
);
const Orders = lazy(() =>
  import("../../modules/customer/components/order/orders")
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
    component: Orders,
  },

  {
    path: AppRoutes.orderDetail,
    component: OrderDetails,
  },

  {
    path: AppRoutes.checkout,
    component: CheckoutStepper,
  },
];

export default authRoutes;
