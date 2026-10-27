export type Facility = "Clinic" | "Laboratory" | "Pharmacy";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type Priority = "Low" | "Medium" | "High";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "F" | "M";
  condition: string;
  phone: string;
  facility: string;
  status: "Active" | "Follow-up" | "Discharged";
  lastVisit: string;
}
export interface Task {
  id: string;
  title: string;
  patientId: string;
  assignee: string;
  due: string;
  status: TaskStatus;
  priority: Priority;
}
export interface Appointment {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string;
  provider: string;
  type: string;
}
export interface Referral {
  id: string;
  patientId: string;
  from: string;
  to: string;
  toType: Facility;
  reason: string;
  status: "Sent" | "Accepted" | "Completed" | "Declined";
  date: string;
}
export interface Escalation {
  id: string;
  patientId: string;
  issue: string;
  daysOverdue: number;
  level: 1 | 2 | 3;
  resolved: boolean;
}
export interface Consent {
  id: string;
  patientId: string;
  party: string;
  partyType: Facility;
  scope: string;
  granted: boolean;
  updated: string;
}
