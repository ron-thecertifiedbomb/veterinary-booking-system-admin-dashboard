export type Slot = {
  time: string;
  available: boolean;
};
export type SlotsResponse = {
  now: string;
  slots: Slot[];
};


export type CreateAppointmentApiResponse = {
  message: string;
  data: Appointment;
};


export type Appointment = {
  bookingCode: string;
  serviceType: string;
  petName: string;
  appointmentDate: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};