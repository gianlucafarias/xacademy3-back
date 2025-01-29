const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
import Courses from "./Courses";
import User from "./User";

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
        model: User,
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

export default Inscription;
