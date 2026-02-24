import { DataTypes, Sequelize, Model, ModelStatic, Optional } from "sequelize";


export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database.sqlite",
  logging: false,
});


type ProjectCreationAttributes = Optional<ProjectAttributes, "id">;
export const Project: ModelStatic<Model<ProjectAttributes, ProjectCreationAttributes>> = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    client: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    initDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "projects",
    timestamps: false,
  }
);

type WorkerCreationAttributes = Optional<WorkerAttributes, "id" | "projectId">;
export const Worker: ModelStatic<Model<WorkerAttributes, WorkerCreationAttributes>> = sequelize.define(
  "Worker",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    seniority: {
      type: DataTypes.ENUM("junior", "semi-senior", "senior"),
      allowNull: false,
      defaultValue: "junior",
    }
  },
  {
    tableName: "workers",
    timestamps: false,
  }
);

// Associations (many-to-many via an explicit join table)
export const ProjectWorker = sequelize.define(
  "ProjectWorker",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  },
  { tableName: "project_workers", timestamps: false }
);

Project.belongsToMany(Worker, {
  through: ProjectWorker,
  as: "workers",
  foreignKey: "projectId",
  otherKey: "workerId",
});
Worker.belongsToMany(Project, {
  through: ProjectWorker,
  as: "projects",
  foreignKey: "workerId",
  otherKey: "projectId",
});

// init connection  helper
export async function initDb({ force = false } = {}) {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true, force });
}

export default {
  sequelize,
  Project,
  Worker,
  ProjectWorker,
};
