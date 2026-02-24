import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Header from "../../components/Header";


export default function NewWorker() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("junior");
  const BACKEND_URL = "http://localhost:3000";


  const handleSubmit = async (e: React.FormEvent) => {0
    e.preventDefault();
    try {
      const body: any = { name, role, seniority };
      const res = await fetch(`${BACKEND_URL}/api/workers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed to create worker");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error creating worker");
    }
  };

  return (
    <>
      <Header />
      <Box className="container mx-auto p-6" component="main" sx={{ maxWidth: 720 }}>
        <Typography variant="h5" gutterBottom>
          Nuevo Trabajador
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Rol" value={role} onChange={(e) => setRole(e.target.value)} required />

          <FormControl>
            <InputLabel id="seniority-label">Seniority</InputLabel>
            <Select
              labelId="seniority-label"
              value={seniority}
              label="Seniority"
              onChange={(e) => setSeniority(e.target.value as string)}
            >
              <MenuItem value="junior">junior</MenuItem>
              <MenuItem value="mid">mid</MenuItem>
              <MenuItem value="senior">senior</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">Crear</Button>
            <Button type="button" variant="outlined" onClick={() => (window.location.href = "/")}>Cancelar</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
