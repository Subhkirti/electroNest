import { combineReducers } from "redux";
import {
  AuthState,
  CartState,
  HeaderState,
  OrderState,
  ProductState,
  RootState,
} from "./storeTypes";
import productReducer from "./customer/product/reducer";
import authReducer from "./customer/auth/reducer";
import cartReducer from "./customer/cart/reducer";
import orderReducer from "./customer/order/reducer";
import headerReducer from "./customer/header/reducer";

const rootReducer = combineReducers<RootState>({
  auth: authReducer as unknown as AuthState,
  product: productReducer as unknown as ProductState,
  cart: cartReducer as unknown as CartState,
  order: orderReducer as unknown as OrderState,
  header: headerReducer as unknown as HeaderState,
});

export default rootReducer;
