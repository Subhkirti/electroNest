const AppRoutes = {
  home: "/",
  register: "/register",
  login: "/login",
  cart: "/cart",
  profile: "/user/:userId",
  products: "/products",
  wishList: "/wishlist",
  thirdLevelProduct: "/products/:categoryId/:sectionId/:itemId",
  secondLevelProduct: "/products/:categoryId/:sectionId",
  firstLevelProduct: "/products/:categoryId",
  productDetail: "/product/:productId",
  checkout: "/checkout",
  payment: "/payment",
  orderDetail: "/orders/:orderId",
  notFound: "/not-found",
  orders: "/orders",
};

export default AppRoutes;
