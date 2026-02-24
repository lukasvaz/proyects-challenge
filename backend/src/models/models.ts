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
      type: DataTypes.INTEGER.UNSIGNED,
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
    timestamps: true,
  }
);

type WorkerCreationAttributes = Optional<WorkerAttributes, "id" | "projectId">;
export const Worker: ModelStatic<Model<WorkerAttributes, WorkerCreationAttributes>> = sequelize.define(
  "Worker",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "projects", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "workers",
    timestamps: true,
  }
);

// Associations
Project.hasMany(Worker, { as: "workers", foreignKey: "projectId" });
Worker.belongsTo(Project, { as: "project", foreignKey: "projectId" });

// init connection  helper
export async function initDb({ force = false } = {}) {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true, force });
}

export default {
  sequelize,
  Project,
  Worker,
};
