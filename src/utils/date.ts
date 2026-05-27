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

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatShortDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};