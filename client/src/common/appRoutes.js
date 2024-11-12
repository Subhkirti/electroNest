const AppRoutes = {
  home: "/",
  register: "/register",
  login: "/login",
  cart: "/cart",
  products: "/products",
  thirdLevelProduct: "/:categoryId/:sectionId/:itemId",
  secondLevelProduct: "/:categoryId/:sectionId",
  firstLevelProduct: "/:categoryId",
  productDetail: "/product/:productId",
  checkout: "/checkout",
  orders: "/account/orders",
  orderDetail: "/account/order/:orderId",
  notFound: "/not-found",
};

export default AppRoutes;
