import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/products",
  findProductsById: apiBaseUrl + "/products/id",

};

export default ApiUrls;
