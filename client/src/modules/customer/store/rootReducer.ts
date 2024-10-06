import { combineReducers } from "redux";
import { AuthState, RootState } from "./storeTypes";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers<RootState>({
  auth: authReducer as unknown as AuthState,
});

export default rootReducer;
