import { ThunkDispatch } from "redux-thunk";
import { User } from "../modules/customer/types/userTypes";
import {
  CategoryState,
  Product,
  TopLevelCategories,
} from "../modules/customer/types/productTypes";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Cart, CartItem } from "../modules/customer/types/cartTypes";
import { Address } from "../modules/customer/types/addressTypes";
import { Order, OrderHistory } from "../modules/customer/types/orderTypes";

interface RootState {
  auth: AuthState;
  product: ProductState;
  cart: CartState;
  order: OrderState;
  header: HeaderState;
  users: UsersState;
  address: AddressState;
  wishlist: WishlistState;
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
  logoutLoader: boolean;
  error: string | null;
}

interface AddressState {
  addresses: Address[];
  address: Address | null;
  activeAddress: Address | null;
  isLoading: boolean;
  error: string | null;
}

interface ProductState {
  topLevelCategories: any[];
  secondLevelCategories: any[];
  thirdLevelCategories: any[];
  categories: CategoryState[];
  products: Product[];
  productsCarousel: ProductsCarouselState[];
  product: Product | null;
  newProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  topLCategoryCount: number;
  secondLCategoryCount: number;
  thirdLCategoryCount: number;
}
interface ProductsCarouselState {
  category: TopLevelCategories;
  products: Product[];
}

interface CartState {
  cartItems: CartItem[];
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

interface OrderState {
  orders: Order[];
  order: Order | null;
  orderHistory: OrderHistory[];
  isLoading: boolean;
  totalCount: number;
  razorpayOrderId: string | null;
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

interface WishlistState {
  products: Product[] | null;
  isLoading: boolean;
  productId: number;
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
  WishlistState,
  UsersState,
  AddressState,
};
