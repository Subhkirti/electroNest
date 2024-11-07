import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  findProducts: apiBaseUrl + "/product-details?",
  getUsers: apiBaseUrl + "/users?",
  findUsers: apiBaseUrl + "/user-details?",
  addUser: apiBaseUrl + "/user/add",
  editUser: apiBaseUrl + "/user/edit?",
  deleteUser: apiBaseUrl + "/user/delete?",
  getProducts: apiBaseUrl + "/products?",
  addProduct: apiBaseUrl + "/product/add",
  deleteProduct: apiBaseUrl + "/product/delete?",
  editProduct: apiBaseUrl + "/product/edit?",
  getCart: apiBaseUrl + "/cart",
  addItemToCart: apiBaseUrl + "/cart/add",
  cartItems: apiBaseUrl + "/cart_items/",
  getOrderHistory: apiBaseUrl + "/orders/",
  getOrder: apiBaseUrl + "/order?id=",
  createOrder: apiBaseUrl + "/order/add",
  getTopLevelCategories: apiBaseUrl + "/top-level-categories",
  getSecondLevelCategories: apiBaseUrl + "/second-level-categories",
  getThirdLevelCategories: apiBaseUrl + "/third-level-categories",
  addTopLevelCategories: apiBaseUrl + "/top-level-categories/add",
  addSecondLevelCategories: apiBaseUrl + "/second-level-categories/add",
  addThirdLevelCategories: apiBaseUrl + "/third-level-categories/add",
  deleteTopLevelCategory: apiBaseUrl + "/top-level-categories/delete?",
  deleteSecondLevelCategory: apiBaseUrl + "/second-level-categories/delete?",
  deleteThirdLevelCategory: apiBaseUrl + "/third-level-categories/delete?",
  uploadFile: "https://v2.convertapi.com/upload",
};

export default ApiUrls;
