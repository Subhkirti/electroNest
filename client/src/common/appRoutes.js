const AppRoutes = {
  home: "/",
  register: "/register",
  login: "/login",
  cart: "/cart",
  products: "/products",
  thirdLevelProduct: "/products/:categoryId/:sectionId/:itemId",
  secondLevelProduct: "/products/:categoryId/:sectionId",
  firstLevelProduct: "/products/:categoryId",
  productDetail: "/product/:productId",
  checkout: "/checkout",
  payment: "/payment",
  orders: "/account/orders",
  orderDetail: "/account/order/:orderId",
  notFound: "/not-found",
};

export default AppRoutes;
