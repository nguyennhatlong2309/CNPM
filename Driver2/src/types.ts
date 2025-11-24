export type StudentStatus = 'pending' | 'picked' | 'dropped';

export interface Student {
  id: string;
  name: string;
  phone?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupOrder: number;
  status: StudentStatus;
}

export interface Trip {
  id: string;
  routeName: string;
  start: string;
  end: string;
  departTime: string; // HH:mm
  students: Student[];
}
