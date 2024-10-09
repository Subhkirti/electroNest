import { User } from "../types/userTypes";

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

export type { RootState, RootAction, AuthState, ProductState };
