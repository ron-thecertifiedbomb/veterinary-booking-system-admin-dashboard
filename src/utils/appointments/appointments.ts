export const sortAppointmentsByDate = (appointments: any[]) => {
  return [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentDate).getTime() -
      new Date(b.appointmentDate).getTime(),
  );
};

export const groupAppointmentsByDate = (appointments: any[]) => {
  return appointments.reduce(
    (acc, item) => {
      const date = new Date(item.appointmentDate);

      // normalize date (remove time)
      const key = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).toISOString();

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);

      return acc;
    },
    {} as Record<string, any[]>,
  );
};

export const getSectionLabel = (dateKey: string) => {
  const today = new Date();
  const target = new Date(dateKey);

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const diff = (target.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  return target.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
};
``;