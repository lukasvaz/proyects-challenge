import  { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { BACKEND_URL } from "~/constants";
type Worker = { id: number; name: string; role: string; seniority: string };
type Project = { id: number; name: string; client?: string; workers?: Worker[] } | null;

export default function Modal({
  open,
  project,
  onClose,
  backendUrl = BACKEND_URL,
  onAssigned,
}: {
  open: boolean;
  project: Project;
  onClose: () => void;
  backendUrl?: string;
  onAssigned?: () => void;
}) {
  const [workersList, setWorkersList] = useState<Worker[]>([]);
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    fetch(`${backendUrl}/api/workers`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setWorkersList(data || []);
      })
      .catch((e) => {
        console.error(e);
        setWorkersList([]);
      })
    return () => {
      mounted = false;
    };
  }, [open, backendUrl]);

  const assign = async (workerId: number) => {
    if (!project) return;
    try {
      const res = await fetch(`${backendUrl}/api/projects/${project.id}/assign/${workerId}`, { method: "POST" });
      if (!res.ok) throw new Error("assign failed");
      onAssigned && onAssigned();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error assigning worker");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{project?.name}</DialogTitle>
      <DialogContent dividers>
          <List>
            {workersList.map((w) => {
              const already = (project?.workers ?? []).some((mw) => mw.id === w.id);
              return (
                <ListItem
                  key={w.id}
                  secondaryAction={
                    <Button variant="contained" size="small" onClick={() => assign(w.id)} disabled={already}>
                      {already ? "Asignado" : "Asignar"}
                    </Button>
                  }
                >
                  <ListItemText primary={w.name} secondary={`${w.role} • ${w.seniority}`} />
                </ListItem>
              );
            })}
          </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
