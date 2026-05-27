export const formatBookingCode = (code: string | undefined): string => {
  if (!code) return "";
  return code.substring(0, 5).toUpperCase();
};



export const formatSlotTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const h = Number(hour);

  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour}:${minute} ${ampm}`;
};
