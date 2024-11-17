import { apiBaseUrl } from "./constants";

const ApiUrls = {
  registerUser: apiBaseUrl + "/register",
  login: apiBaseUrl + "/signin",
  getUsers: apiBaseUrl + "/users?",
  findUsers: apiBaseUrl + "/user-details?",
  addUser: apiBaseUrl + "/user/add",
  editUser: apiBaseUrl + "/user/edit?",
  deleteUser: apiBaseUrl + "/user/delete?",
  findProducts: apiBaseUrl + "/find-products",
  productDetails: apiBaseUrl + "/product-details?",
  getProducts: apiBaseUrl + "/products?",
  addProduct: apiBaseUrl + "/product/add",
  deleteProduct: apiBaseUrl + "/product/delete?",
  editProduct: apiBaseUrl + "/product/edit?",
  getCart: apiBaseUrl + "/cart",
  addItemToCart: apiBaseUrl + "/cart-items/add",
  removeItemFromCart: apiBaseUrl + "/cart-items/remove",
  reduceItemFromCart: apiBaseUrl + "/cart-items/reduce",
  getCartItems: apiBaseUrl + "/cart_items?",
  getOrderHistory: apiBaseUrl + "/orders",
  getOrder: apiBaseUrl + "/order?id=",
  createOrder: apiBaseUrl + "/order/create",
  addAddress: apiBaseUrl + "/address/add",
  getAddresses: apiBaseUrl + "/addresses?",
  setActiveAddress: apiBaseUrl + "/address/set-active",
  editAddress: apiBaseUrl + "/address/edit",
  deleteAddress: apiBaseUrl + "/address/delete",
  getCategories: apiBaseUrl + "/product/categories",
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
