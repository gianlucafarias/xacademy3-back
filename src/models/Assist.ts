import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Courses from "./Courses";
import Student from "./Student";

const Assist = sequelize.define(
  "Assists",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Courses,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    attendanceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "assists",
    timestamps: true,
  }
);

Assist.belongsTo(Courses, {
  foreignKey: "course_id",
  as: "course", // Cambio de "courses" a "course"
});

Assist.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student", // Correcto
});

export default Assist;