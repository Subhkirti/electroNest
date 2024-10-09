import { combineReducers } from "redux";
import { AuthState, ProductState, RootState } from "./storeTypes";
import productReducer from "./customer/product/reducer";
import authReducer from "./customer/auth/reducer";

const rootReducer = combineReducers<RootState>({
  auth: authReducer as unknown as AuthState,
  product: productReducer as unknown as ProductState,
});

export default rootReducer;
