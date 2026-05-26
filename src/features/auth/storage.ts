// src/features/auth/storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export async function setStorageItem(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }

  await AsyncStorage.setItem(key, value);
}

export async function getStorageItem(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }

  return AsyncStorage.getItem(key);
}



export async function removeStorageItem(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }

  await AsyncStorage.removeItem(key);
}

