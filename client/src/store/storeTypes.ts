import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { User } from "../modules/customer/types/userTypes";
import { Product } from "../modules/customer/types/productTypes";

interface RootState {
  auth: AuthState;
  product: ProductState;
  cart: CartState;
  order: OrderState;
}

interface RootAction {
  type: string;
  payload?: any;
}

type AppDispatch = ThunkDispatch<RootState, unknown, RootAction>;

type ActionDispatch = (arg0: RootAction) => void;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface ProductState {
  topLevelCategories: [];
  secondLevelCategories: [];
  thirdLevelCategories: [];
  products: Product[];
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  totalProductCount: number;
}

interface CartState {
  cartItems: [];
  cart: {} | null;
  isLoading: boolean;
  error: string | null;
}

interface OrderState {
  orders: [];
  order: {} | null;
  isLoading: boolean;
  error: string | null;
}

export type {
  RootState,
  RootAction,
  AppDispatch,
  ActionDispatch,
  AuthState,
  ProductState,
  CartState,
  OrderState,
};
