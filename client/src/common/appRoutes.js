const AppRoutes = {
  home: "/",
  register: "/register",
  login: "/login",
  cart: "/cart",
  product: "/:levelOne/:levelTwo/:levelThree",
  productDetail: "/product/:productId",
  checkout: "/checkout",
  orders: "/account/orders",
  orderDetail: "/account/order/:orderId",
  notFound: "/not-found",
};

export default AppRoutes;
