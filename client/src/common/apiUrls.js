import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/product-details?",
  getProducts: apiBaseUrl + "/products?",
  addProduct: apiBaseUrl + "/product/add",
  deleteProduct: apiBaseUrl + "/product/delete?",
  getCart: apiBaseUrl + "/cart",
  addItemToCart: apiBaseUrl + "/cart/add",
  cartItems: apiBaseUrl + "/cart_items/",
  getOrderHistory: apiBaseUrl + "/orders/",
  getOrder: apiBaseUrl + "/order?id=",
  createOrder: apiBaseUrl + "/order/add",
  getTopLevelCategories: apiBaseUrl + "/top-level-categories",
  getSecondLevelCategories: apiBaseUrl + "/second-level-categories",
  getThirdLevelCategories: apiBaseUrl + "/third-level-categories",
  uploadFile: "https://v2.convertapi.com/upload",
};

export default ApiUrls;
