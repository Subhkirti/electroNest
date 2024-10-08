import { User } from "../types/userTypes";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface RootState {
  auth: AuthState;
}

interface RootAction {
  type: string;
  payload?: any;
}

export type { RootState, AuthState, RootAction };
