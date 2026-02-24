import express from "express";
import { Project, Worker } from "../models/models";

const router = express.Router();


router.post("/projects", async (req, res) => {
  const { name, client, initDate, endDate } = req.body;
  if (!name || !client) return res.status(400).json({ error: "name and client are required" });

  try {
    const project = await Project.create({
      name,
      client,
      initDate: initDate ? new Date(initDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });
    return res.status(201).json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to create project" });
  }
});


router.post("/workers", async (req, res) => {
  const { name, role, seniority, projectId } = req.body;
  if (!name || !role) return res.status(400).json({ error: "name and role are required" });

  try {
    const worker = await Worker.create({
      name,
      role,
      seniority: seniority || "junior",
      projectId: projectId ?? null,
    });
    return res.status(201).json(worker);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to create worker" });
  }
});


router.post("/projects/:projectId/assign/:workerId", async (req, res) => {
  const { projectId, workerId } = req.params;

  try {
    const project = await Project.findByPk(projectId as any);
    if (!project) return res.status(404).json({ error: "project not found" });

    const worker = await Worker.findByPk(workerId as any);
    if (!worker) return res.status(404).json({ error: "worker not found" });

    worker.set("projectId", project.get("id") as any);
    await worker.save();

    return res.json(worker);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to assign worker" });
  }
});


// List all workers (include their project)
router.get("/workers", async (_req, res) => {
  try {
    const workers = await Worker.findAll({ include: [{ model: Project, as: "project" }] });
    return res.json(workers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to list workers" });
  }
});

// List all projects (include assigned workers)
router.get("/projects", async (_req, res) => {
  try {
    const projects = await Project.findAll({ include: [{ model: Worker, as: "workers" }] });
    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to list projects" });
  }
});

export default router;
