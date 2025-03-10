import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Class from "./Class";
import Student from "./Student";

const Assist = sequelize.define(
  "Assists",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
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

Assist.belongsTo(Class, {
  foreignKey: "class_id",
  as: "class", 
});

Assist.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

export default Assist;