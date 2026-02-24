import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "../../components/Header";
import Button from "@mui/material/Button";
import Modal from "./Modal";
import { BACKEND_URL } from "~/constants";

type Worker = {
  id: number;
  name: string;
  role: string;
  seniority: string;
}; 
type Project = {
  id: number;
  name: string;
  client: string;
  initDate?: string | null;
  endDate?: string | null;
  workers?: Worker[];
};

export default function Home() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  
  const fetchProjects = () => {
    fetch(`${BACKEND_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  };

  useEffect(() => {
    let mounted = true;
    fetch(`${BACKEND_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setProjects(data);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddWorkerModal = (project: Project) => {
    setModalProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalProject(null);
  };

  return (
    <>
      <Header />
      <Box className="p-6 container mx-auto">
        <Typography variant="h4" gutterBottom>
          Proyectos
        </Typography>
        {!projects || projects.length === 0 ? (
          <> </>
        ) : (
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {projects.map((project) => (
              <div key={project.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => toggle(project.id)}>
                    <ListItemText
                      primary={`${project.name} — ${project.client}`}
                      secondary={
                        project.initDate || project.endDate
                          ? `${project.initDate ?? "-"} - ${project.endDate ?? "-"}`
                          : undefined
                      }
                    />
                  </ListItemButton>
                </ListItem>

                <Collapse in={Boolean(openMap[project.id])} >
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    {(project.workers ?? []).length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No hay trabajadores asignados" />
                      </ListItem>
                    ) : (
                      project.workers!.map((w) => (
                        <ListItem key={w.id}>
                          <ListItemText primary={w.name} secondary={`${w.role} | ${w.seniority}`} />
                        </ListItem>
                      ))
                    )}

                    <ListItem>
                      <Button variant="outlined" size="small" onClick={() => openAddWorkerModal(project)}>
                        Añadir trabajador
                      </Button>
                    </ListItem>
                  </List>
                </Collapse>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </Box>
      <Modal open={modalOpen} project={modalProject} onClose={closeModal} onAssigned={() => fetchProjects()} />
    </>
  );
}
