import { Project, Worker, initDb, sequelize } from "../models/models";

function randomFrom<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("randomFrom: empty array");
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const projectNames = [
  "Alpha App",
  "Beta Portal",
  "Gamma Platform",
  "Delta System",
  "Epsilon Service",
] as const;

const clients = ["ACME", "Globex", "Initech", "Umbrella", "Soylent"] as const;
const workerNames = ["Ana", "Luis", "María", "Jorge", "Sofía", "Carlos", "Elena", "Diego"] as const;
const roles = ["frontend", "backend", "diseño", "qa", "devops"] as const;
const seniorities = ["junior", "semi-senior", "senior"] as const;

export default async function runSeed() {
  try {
    await initDb();

    console.log("Creating projects...");
    const createdProjects = [] as any[];
    for (let i = 0; i < 5; i++) {
      const init = new Date();
      const end = Math.random() < 0.5 ? new Date(init.getTime() + (30 + Math.floor(Math.random() * 181)) * 24 * 60 * 60 * 1000) : null;
      const project = await Project.create({
        name: projectNames[i] ?? `Project ${i + 1}`,
        client: randomFrom(clients),
        initDate: init,
        endDate: end,
      });
      createdProjects.push(project);
    }

    console.log("Creating workers...");
    const createdWorkers = [] as any[];
    for (let i = 0; i < 5; i++) {
      const worker = await Worker.create({
        name: randomFrom(workerNames),
        role: randomFrom(roles),
        seniority: randomFrom(seniorities) as any,
      });
      createdWorkers.push(worker);
    }

    console.log("Seed finished.");
    console.log("Projects:", (await Project.findAll({ include: [{ model: Worker, as: "workers" }] })).map(p => p.get()));
    console.log("Workers:", (await Worker.findAll({ include: [{ model: Project, as: "projects" }] })).map(w => w.get()));
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await sequelize.close();
  }
}

const entry = process.argv[1] || "";
if (entry.endsWith("src/commands/seed.ts") || entry.endsWith("src\\commands\\seed.ts")) {
  runSeed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
