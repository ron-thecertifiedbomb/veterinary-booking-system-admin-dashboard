
export const sortAppointmentsByDate = (appointments: any[]) => {
  return [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentDate).getTime() -
      new Date(b.appointmentDate).getTime()
  );
};
