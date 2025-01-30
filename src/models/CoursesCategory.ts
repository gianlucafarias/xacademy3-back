const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
import Courses from "./Courses";

const CoursesCategory = sequelize.define(
  "CoursesCategory",
  {
    id: {
      type: DataTypes.INTEGER(100),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      reference: {
        Courses,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "courses_category",
  }
);
