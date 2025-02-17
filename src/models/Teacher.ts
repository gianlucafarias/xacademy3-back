import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
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
    specialty: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "teacher",
    timestamps: false,
  }
);

// un profesor tiene un usuario
Teacher.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export default Teacher;
