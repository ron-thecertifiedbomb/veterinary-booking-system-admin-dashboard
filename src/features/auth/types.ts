// src/features/auth/types.ts

export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};


export type LoginPayload = {
  email: string;
  password: string;
};


export type LoginResponse = {
  message: string;
  access_token: string;
  user: AuthUser;
};
