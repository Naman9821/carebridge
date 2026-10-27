import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import type { Patient } from "@/data/types";
import { Badge, Btn, Card, Field, Modal, PageHeader, inputCls, statusTone } from "@/components/ui-kit";

export const Route = createFileRoute("/patients")({
  head: () => ({
    meta: [
      { title: "Patients — CareBridge" },
      { name: "description", content: "Manage patients across clinics, labs and pharmacies." },
      { property: "og:title", content: "Patients — CareBridge" },
      { property: "og:description", content: "Manage patients across clinics, labs and pharmacies." },
    ],
  }),
  component: Patients,
});

const empty = { name: "", age: 40, gender: "F" as const, condition: "", phone: "", facility: "Riverside Clinic", status: "Active" as const };

function Patients() {
  const s = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Patient, "id" | "lastVisit">>(empty);
  const list = s.patients.filter((p) => (p.name + p.condition + p.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Patients" subtitle={`${s.patients.length} patients in your network`} action={<Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add patient</Btn>} />
      <Card className="p-0">
        <div className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input className={inputCls + " pl-9"} placeholder="Search by name, condition, ID…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>{["Patient", "Age", "Condition", "Facility", "Last visit", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.id} · {p.phone}</p></td>
                  <td className="px-4 py-3">{p.age} {p.gender}</td>
                  <td className="px-4 py-3">{p.condition}</td>
                  <td className="px-4 py-3">{p.facility}</td>
                  <td className="px-4 py-3">{p.lastVisit}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Btn variant="ghost" aria-label="Remove" onClick={() => { s.removePatient(p.id); toast.success(`${p.name} removed`); }}><Trash2 className="h-4 w-4" /></Btn>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No patients found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Add patient">
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name) { toast.error("Name is required"); return; }
            s.addPatient({ ...form, lastVisit: new Date().toISOString().slice(0, 10) });
            toast.success("Patient added");
            setForm(empty); setOpen(false);
          }}
        >
          <Field label="Full name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Age"><input type="number" className={inputCls} value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} /></Field>
          <Field label="Gender"><select className={inputCls} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as "F" | "M" })}><option>F</option><option>M</option></select></Field>
          <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Condition"><input className={inputCls} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} /></Field>
          <Field label="Facility"><select className={inputCls} value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })}>{["Riverside Clinic", "Harbor Family Health", "Northgate Medical"].map((f) => <option key={f}>{f}</option>)}</select></Field>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2"><Btn type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn type="submit">Save patient</Btn></div>
        </form>
      </Modal>
    </>
  );
}
