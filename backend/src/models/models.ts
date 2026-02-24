import { DataTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database.sqlite",
  logging: false,
});

export const Project = sequelize.define(
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

export const Worker = sequelize.define(
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
