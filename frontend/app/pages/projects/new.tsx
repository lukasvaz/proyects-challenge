import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Header from "../../components/Header";

export default function NewProject() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [initDate, setInitDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const BACKEND_URL = "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, client, initDate: initDate || null, endDate: endDate || null }),
      });
      if (!res.ok) throw new Error("failed to create project");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <>
      <Header />
      <Box className="container mx-auto p-6" component="main" sx={{ maxWidth: 720 }}>
        <Typography variant="h5" gutterBottom>
          Nuevo Proyecto
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Cliente" value={client} onChange={(e) => setClient(e.target.value)} required />

          <TextField
            label="Fecha inicio"
            type="date"
            value={initDate}
            onChange={(e) => setInitDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Fecha fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">Crear</Button>
            <Button type="button" variant="outlined" onClick={() => (window.location.href = "/")}>Cancelar</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
