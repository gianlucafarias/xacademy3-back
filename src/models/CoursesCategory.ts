import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";

const CoursesCategory = sequelize.define(
  "CoursesCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "courses_category",
    timestamps: false,
  }
);


export default CoursesCategory;
