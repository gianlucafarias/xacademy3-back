const { DataTypes } = require("sequelize");
const sequelize = require("config");
import Courses from "./Courses";
import Student from "./Student";

const Assist = sequelize.define(
  "Assist",
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
    attendanceDate:{
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    tableName: "assist",
  }
);

export default Assist;