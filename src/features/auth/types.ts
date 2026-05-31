// src/features/auth/types.ts

import { Pet } from "@/features/pet/types";

export type UserRole = "USER" | "ADMIN" | "STAFF";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  specialization?: string;
  department?: string;

  pets?: Pet[];
};
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  data: {
    access_token: string;
    user: AuthUser;
  };
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export type RegisterResponse = {
  message: string;
  data: AuthUser;
};


