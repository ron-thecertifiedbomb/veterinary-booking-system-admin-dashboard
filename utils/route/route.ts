import { usePathname } from "expo-router";

export const useCurrentPath = () => {
  const pathname = usePathname();

  return pathname;
};
