import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/types";
import { User } from "@/features/users/types";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
  setSession: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<LoginResponse | null>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse | null>;
};
