import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import type { Priority, TaskStatus } from "@/data/types";
import { Badge, Btn, Card, Field, Modal, PageHeader, inputCls, statusTone } from "@/components/ui-kit";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Tracker — CareBridge" },
      { name: "description", content: "Track care tasks by status across your network." },
      { property: "og:title", content: "Task Tracker — CareBridge" },
      { property: "og:description", content: "Track care tasks by status across your network." },
    ],
  }),
  component: Tasks,
});

const cols: TaskStatus[] = ["Pending", "In Progress", "Completed", "Overdue"];

function Tasks() {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", patientId: s.patients[0]?.id ?? "", assignee: "Dr. Chen", due: new Date().toISOString().slice(0, 10), priority: "Medium" as Priority });

  return (
    <>
      <PageHeader title="Task Tracker" subtitle="Move tasks across stages as care progresses." action={<Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New task</Btn>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => {
          const items = s.tasks.filter((t) => t.status === c);
          return (
            <div key={c} className="rounded-2xl bg-muted p-3">
              <div className="mb-3 flex items-center justify-between px-1"><Badge tone={statusTone(c)}>{c}</Badge><span className="text-xs text-muted-foreground">{items.length}</span></div>
              <div className="space-y-3">
                {items.map((t) => (
                  <Card key={t.id} className="p-4">
                    <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{t.title}</p><Badge tone={statusTone(t.priority)}>{t.priority}</Badge></div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.patientName(t.patientId)} · {t.assignee}</p>
                    <p className="text-xs text-muted-foreground">Due {t.due}</p>
                    <select
                      aria-label="Change status"
                      className={inputCls + " mt-3 py-1.5 text-xs"}
                      value={t.status}
                      onChange={(e) => { s.setTaskStatus(t.id, e.target.value as TaskStatus); toast.success(`Moved to ${e.target.value}`); }}
                    >
                      {cols.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Card>
                ))}
                {items.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New task">
        <form className="grid gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (!f.title) { toast.error("Title is required"); return; }
          const status: TaskStatus = f.due < new Date().toISOString().slice(0, 10) ? "Overdue" : "Pending";
          s.addTask({ ...f, status }); toast.success("Task created"); setOpen(false); setF({ ...f, title: "" });
        }}>
          <Field label="Title"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Patient"><select className={inputCls} value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })}>{s.patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Assignee"><input className={inputCls} value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })} /></Field>
            <Field label="Due"><input type="date" className={inputCls} value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
            <Field label="Priority"><select className={inputCls} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>{["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}</select></Field>
          </div>
          <div className="flex justify-end gap-2 pt-2"><Btn type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn type="submit">Create task</Btn></div>
        </form>
      </Modal>
    </>
  );
}
