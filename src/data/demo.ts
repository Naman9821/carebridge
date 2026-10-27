// Synthetic demo data. All names and records are fictional.
import type { Appointment, Consent, Escalation, Patient, Referral, Task } from "./types";

const d = (offset: number) => {
  const x = new Date();
  x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
};

export const patients: Patient[] = [
  { id: "P001", name: "Aarav Mehta", age: 54, gender: "M", condition: "Type 2 Diabetes", phone: "555-0101", facility: "Riverside Clinic", status: "Follow-up", lastVisit: d(-12) },
  { id: "P002", name: "Lena Okafor", age: 32, gender: "F", condition: "Prenatal Care", phone: "555-0102", facility: "Harbor Family Health", status: "Active", lastVisit: d(-3) },
  { id: "P003", name: "Mateo Silva", age: 67, gender: "M", condition: "Hypertension", phone: "555-0103", facility: "Riverside Clinic", status: "Active", lastVisit: d(-20) },
  { id: "P004", name: "Priya Raman", age: 45, gender: "F", condition: "Asthma", phone: "555-0104", facility: "Northgate Medical", status: "Follow-up", lastVisit: d(-35) },
  { id: "P005", name: "Jonah Weiss", age: 29, gender: "M", condition: "Post-op Recovery", phone: "555-0105", facility: "Harbor Family Health", status: "Active", lastVisit: d(-6) },
  { id: "P006", name: "Sofia Lindqvist", age: 71, gender: "F", condition: "COPD", phone: "555-0106", facility: "Northgate Medical", status: "Follow-up", lastVisit: d(-41) },
  { id: "P007", name: "Kwame Asante", age: 38, gender: "M", condition: "Anemia", phone: "555-0107", facility: "Riverside Clinic", status: "Discharged", lastVisit: d(-60) },
  { id: "P008", name: "Mei Tanaka", age: 50, gender: "F", condition: "Thyroid Disorder", phone: "555-0108", facility: "Northgate Medical", status: "Active", lastVisit: d(-9) },
];

export const tasks: Task[] = [
  { id: "T1", title: "Review HbA1c lab results", patientId: "P001", assignee: "Dr. Chen", due: d(1), status: "Pending", priority: "High" },
  { id: "T2", title: "Refill inhaler prescription", patientId: "P004", assignee: "MedPlus Pharmacy", due: d(-2), status: "Overdue", priority: "High" },
  { id: "T3", title: "Schedule ultrasound", patientId: "P002", assignee: "Nurse Patel", due: d(3), status: "In Progress", priority: "Medium" },
  { id: "T4", title: "Wound check call", patientId: "P005", assignee: "Nurse Patel", due: d(0), status: "Pending", priority: "Medium" },
  { id: "T5", title: "Spirometry follow-up", patientId: "P006", assignee: "Dr. Alvarez", due: d(-5), status: "Overdue", priority: "High" },
  { id: "T6", title: "Blood pressure log review", patientId: "P003", assignee: "Dr. Chen", due: d(-1), status: "Completed", priority: "Low" },
  { id: "T7", title: "TSH panel order", patientId: "P008", assignee: "ClearPath Labs", due: d(2), status: "In Progress", priority: "Medium" },
  { id: "T8", title: "Iron supplement counseling", patientId: "P007", assignee: "MedPlus Pharmacy", due: d(-8), status: "Completed", priority: "Low" },
];

export const appointments: Appointment[] = [
  { id: "A1", patientId: "P001", date: d(1), time: "09:30", provider: "Dr. Chen", type: "Diabetes review" },
  { id: "A2", patientId: "P002", date: d(2), time: "11:00", provider: "Dr. Ndlovu", type: "Prenatal visit" },
  { id: "A3", patientId: "P003", date: d(0), time: "14:15", provider: "Dr. Chen", type: "BP check" },
  { id: "A4", patientId: "P005", date: d(4), time: "10:00", provider: "Dr. Alvarez", type: "Post-op review" },
  { id: "A5", patientId: "P008", date: d(6), time: "15:30", provider: "Dr. Ndlovu", type: "Lab results" },
  { id: "A6", patientId: "P004", date: d(8), time: "08:45", provider: "Dr. Alvarez", type: "Asthma plan" },
];

export const referrals: Referral[] = [
  { id: "R1", patientId: "P001", from: "Riverside Clinic", to: "ClearPath Labs", toType: "Laboratory", reason: "HbA1c & lipid panel", status: "Completed", date: d(-10) },
  { id: "R2", patientId: "P004", from: "Northgate Medical", to: "MedPlus Pharmacy", toType: "Pharmacy", reason: "Inhaler refill", status: "Sent", date: d(-3) },
  { id: "R3", patientId: "P006", from: "Northgate Medical", to: "Pulmonary Specialists", toType: "Clinic", reason: "Pulmonology consult", status: "Accepted", date: d(-7) },
  { id: "R4", patientId: "P008", from: "Northgate Medical", to: "ClearPath Labs", toType: "Laboratory", reason: "Thyroid panel", status: "Sent", date: d(-1) },
];

export const escalations: Escalation[] = [
  { id: "E1", patientId: "P006", issue: "Missed spirometry follow-up", daysOverdue: 5, level: 2, resolved: false },
  { id: "E2", patientId: "P004", issue: "Prescription not picked up", daysOverdue: 2, level: 1, resolved: false },
  { id: "E3", patientId: "P001", issue: "No response to lab callback", daysOverdue: 9, level: 3, resolved: false },
];

export const consents: Consent[] = [
  { id: "C1", patientId: "P001", party: "ClearPath Labs", partyType: "Laboratory", scope: "Lab results sharing", granted: true, updated: d(-30) },
  { id: "C2", patientId: "P001", party: "MedPlus Pharmacy", partyType: "Pharmacy", scope: "Prescription history", granted: true, updated: d(-30) },
  { id: "C3", patientId: "P004", party: "MedPlus Pharmacy", partyType: "Pharmacy", scope: "Prescription history", granted: true, updated: d(-14) },
  { id: "C4", patientId: "P006", party: "Pulmonary Specialists", partyType: "Clinic", scope: "Full medical record", granted: false, updated: d(-7) },
  { id: "C5", patientId: "P008", party: "ClearPath Labs", partyType: "Laboratory", scope: "Lab results sharing", granted: true, updated: d(-2) },
];
