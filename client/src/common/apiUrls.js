import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/products",
  findProductsById: apiBaseUrl + "/products/id",
  addItemToCart: apiBaseUrl + "/cart/add",
  removeItemToCart: apiBaseUrl + "/cart/remove",
  updateItemToCart: apiBaseUrl + "/cart/update",


};

export default ApiUrls;
