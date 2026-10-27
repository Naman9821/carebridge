// In-memory data store. Swap these actions for API/database calls later;
// pages only use the hook below, never the demo arrays directly.
import { createContext, useContext, useState, type ReactNode } from "react";
import * as demo from "./demo";
import type { Appointment, Consent, Escalation, Patient, Referral, Task, TaskStatus } from "./types";

const uid = (p: string) => `${p}${Date.now().toString(36)}`;

function useStoreValue() {
  const [patients, setPatients] = useState<Patient[]>(demo.patients);
  const [tasks, setTasks] = useState<Task[]>(demo.tasks);
  const [appointments, setAppointments] = useState<Appointment[]>(demo.appointments);
  const [referrals, setReferrals] = useState<Referral[]>(demo.referrals);
  const [escalations, setEscalations] = useState<Escalation[]>(demo.escalations);
  const [consents, setConsents] = useState<Consent[]>(demo.consents);

  return {
    patients, tasks, appointments, referrals, escalations, consents,
    patientName: (id: string) => patients.find((p) => p.id === id)?.name ?? "Unknown",
    addPatient: (p: Omit<Patient, "id">) => setPatients((s) => [{ ...p, id: uid("P") }, ...s]),
    removePatient: (id: string) => setPatients((s) => s.filter((p) => p.id !== id)),
    addTask: (t: Omit<Task, "id">) => setTasks((s) => [{ ...t, id: uid("T") }, ...s]),
    setTaskStatus: (id: string, status: TaskStatus) =>
      setTasks((s) => s.map((t) => (t.id === id ? { ...t, status } : t))),
    addAppointment: (a: Omit<Appointment, "id">) => setAppointments((s) => [...s, { ...a, id: uid("A") }]),
    cancelAppointment: (id: string) => setAppointments((s) => s.filter((a) => a.id !== id)),
    addReferral: (r: Omit<Referral, "id">) => setReferrals((s) => [{ ...r, id: uid("R") }, ...s]),
    setReferralStatus: (id: string, status: Referral["status"]) =>
      setReferrals((s) => s.map((r) => (r.id === id ? { ...r, status } : r))),
    escalate: (id: string) =>
      setEscalations((s) => s.map((e) => (e.id === id ? { ...e, level: Math.min(3, e.level + 1) as 1 | 2 | 3 } : e))),
    resolveEscalation: (id: string) =>
      setEscalations((s) => s.map((e) => (e.id === id ? { ...e, resolved: true } : e))),
    toggleConsent: (id: string) =>
      setConsents((s) =>
        s.map((c) => (c.id === id ? { ...c, granted: !c.granted, updated: new Date().toISOString().slice(0, 10) } : c)),
      ),
  };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useStoreValue()}>{children}</Ctx.Provider>;
}
export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
