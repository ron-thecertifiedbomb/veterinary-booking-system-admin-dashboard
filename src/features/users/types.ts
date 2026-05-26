export type Appointment = {
  bookingCode: string;
  serviceType: string;
  petName: string;
  appointmentDate: string; // ISO string
  status: "booked" | "cancelled" | "completed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type GetUserAppointmentsResponse = {
  message: string;
  data: Appointment[];
};
``;