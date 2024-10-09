import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { User } from "../modules/customer/types/userTypes";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface ProductState {
  products: [];
  product: {};
  isLoading: boolean;
  error: string | null;
}

interface RootState {
  auth: AuthState;
  product: ProductState;
}

interface RootAction {
  type: string;
  payload?: any;
}

type AppDispatch = ThunkDispatch<RootState, unknown, RootAction>;

type ActionDispatch = (arg0: RootAction) => void;

export type {
  RootState,
  RootAction,
  AppDispatch,
  ActionDispatch,
  AuthState,
  ProductState,
};
