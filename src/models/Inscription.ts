import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Courses from "./Courses";
import Student from "./Student";

const Inscription = sequelize.define(
  "Inscription",
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
    regirationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inscription",
    timestamps: true,
  }
);
// una inscripcion tiene una curso
Inscription.belongsTo(Courses, {
  foreignKey: "course_id",
  as: "course", 
});
//una inscripcion tiene un estudiante
Inscription.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});
export default Inscription;
