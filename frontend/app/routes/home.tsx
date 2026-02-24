import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "../components/Header";

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
  const BACKEND_URL = "http://localhost:3000";

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
                        ? `Inicio: ${project.initDate ?? "-"}  •  Fin: ${project.endDate ?? "-"}`
                        : undefined
                    }
                  />
                  <Box component="span" sx={{ ml: 2 }}>
                    {openMap[project.id] ? "▼" : "▶"}
                  </Box>
                </ListItemButton>
              </ListItem>

              <Collapse in={Boolean(openMap[project.id])} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {(project.workers ?? []).length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No hay trabajadores asignados" />
                    </ListItem>
                  ) : (
                    project.workers!.map((w) => (
                      <ListItem key={w.id}>
                        <ListItemText primary={w.name} secondary={`${w.role} • ${w.seniority}`} />
                      </ListItem>
                    ))
                  )}
                </List>
              </Collapse>

              <Divider />
            </div>
          ))}
        </List>
      )}
    </Box>
    </>
  );
}
