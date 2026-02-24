import express from "express";
import { Project, Worker } from "../models/models";

const router = express.Router();

// Create a new project
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

// Create a new worker (optionally assign to a project via projectId)
router.post("/workers", async (req, res) => {
  const { name, role, seniority, projectId } = req.body;
  if (!name || !role) return res.status(400).json({ error: "name and role are required" });

  try {
    const worker = await Worker.create({
      name,
      role,
      seniority: seniority || "junior",
    });

    if (projectId) {
      const project = await Project.findByPk(projectId as any);
      if (!project) return res.status(404).json({ error: "project not found to assign" });
      await (project as any).addWorker(worker); // association mixin
    }

    const workerWithProjects = await Worker.findByPk(worker.get("id") as any, { include: [{ model: Project, as: "projects" }] });
    return res.status(201).json(workerWithProjects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to create worker" });
  }
});

// Assign a worker to a project using many-to-many association
router.post("/projects/:projectId/assign/:workerId", async (req, res) => {
  const { projectId, workerId } = req.params;

  try {
    const project = await Project.findByPk(projectId as any);
    if (!project) return res.status(404).json({ error: "project not found" });

    const worker = await Worker.findByPk(workerId as any);
    if (!worker) return res.status(404).json({ error: "worker not found" });

    await (project as any).addWorker(worker);

    const updatedWorker = await Worker.findByPk(workerId as any, { include: [{ model: Project, as: "projects" }] });
    return res.json(updatedWorker);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "failed to assign worker" });
  }
});

// List all workers (include their projects)
router.get("/workers", async (_req, res) => {
  try {
    const workers = await Worker.findAll({ include: [{ model: Project, as: "projects" }] });
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
