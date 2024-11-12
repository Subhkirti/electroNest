import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { User } from "../modules/customer/types/userTypes";
import {
  CategoryState,
  Product,
  SecondLevelCategories,
  ThirdLevelCategories,
  TopLevelCategories,
} from "../modules/customer/types/productTypes";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { CartItem } from "../modules/customer/types/cartTypes";

interface RootState {
  auth: AuthState;
  product: ProductState;
  cart: CartState;
  order: OrderState;
  header: HeaderState;
  users: UsersState;
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
  topLevelCategories: any[];
  secondLevelCategories: any[];
  thirdLevelCategories: any[];
  categories: CategoryState[];
  products: Product[];
  product: Product | null;
  newProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  topLCategoryCount: number;
  secondLCategoryCount: number;
  thirdLCategoryCount: number;
}

interface CartState {
  cartItems: CartItem[];
  cart: CartItem | null;
  isLoading: boolean;
  error: string | null;
}

interface OrderState {
  orders: [];
  order: {} | null;
  isLoading: boolean;
  error: string | null;
}

interface UsersState {
  users: User[];
  user: User | null;
  newUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

interface HeaderButtons {
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  onClick: () => void;
  text: string;
}

interface HeaderState {
  title: string;
  showBackIcon?: boolean;
  buttons?: HeaderButtons[];
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
  HeaderState,
  UsersState,
};
