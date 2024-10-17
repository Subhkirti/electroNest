import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/products",
  findProductsById: apiBaseUrl + "/products/",
  addProduct: apiBaseUrl + "/product/add",
  getCart: apiBaseUrl + "/cart",
  addItemToCart: apiBaseUrl + "/cart/add",
  cartItems: apiBaseUrl + "/cart_items/",
  getOrderHistory: apiBaseUrl + "/orders/",
  getOrder: apiBaseUrl + "/order?id=",
  createOrder: apiBaseUrl + "/order/add",
  getTopLevelCategories: apiBaseUrl + "/top-level-categories",
  getSecondLevelCategories: apiBaseUrl + "/second-level-categories",
  getThirdLevelCategories: apiBaseUrl + "/third-level-categories",
};

export default ApiUrls;
