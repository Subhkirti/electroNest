import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/products",
  findProductsById: apiBaseUrl + "/products/",
  addProduct: apiBaseUrl + "/products/add",
  getCart: apiBaseUrl + "/cart",
  addItemToCart: apiBaseUrl + "/cart/add",
  cartItems: apiBaseUrl + "/cart_items/",
  getOrderHistory: apiBaseUrl + "/orders/",
  getOrder: apiBaseUrl + "/order?id=",
  createOrder: apiBaseUrl + "/order",
};

export default ApiUrls;
