// ✅ always PH-safe YYYY-MM-DD
export const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
};

// ✅ normalize ANY input date → PH YYYY-MM-DD
export const formatPHDate = (input: Date | string) => {
  return new Date(input).toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });
};

// ✅ display date (safe)
// ✅ display date (NO SHIFT, PH-safe)
export const formatDate = (date: string) => {

  // ✅ If already "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);

    // Create LOCAL date (no UTC conversion)
    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // ✅ fallback for ISO strings
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ✅ display time (safe)
export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  const suffix = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}