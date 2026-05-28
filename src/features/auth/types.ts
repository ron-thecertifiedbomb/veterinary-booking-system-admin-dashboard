// src/features/auth/types.ts

export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id?: string; // ✅ from backend
  userId?: string; // ✅ normalized version
  name: string;
  email: string;
  role: UserRole;
  // add other fields if needed
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


export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export type RegisterResponse = {
  message: string;
  access_token: string;
  user: AuthUser;
};