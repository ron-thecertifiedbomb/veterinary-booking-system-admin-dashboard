export type Slot = {
  time: string;
  available: boolean;
};
export type SlotsResponse = {
  now: string;
  slots: Slot[];
};
