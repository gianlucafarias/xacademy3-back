const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
import Courses from "./Courses";
import User from "./User";

const Teacher = sequelize.define(
  "Teacher",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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
    specialty:{
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    tableName: "teacher",
  }
);

export default Teacher;
