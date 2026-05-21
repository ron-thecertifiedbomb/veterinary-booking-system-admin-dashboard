export const formatBookingCode = (code: string | undefined): string => {
  if (!code) return "";
  return code.substring(0, 5).toUpperCase();
};
