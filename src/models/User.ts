import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userRole: {
      type: DataTypes.ENUM("ADMIN", "TEACHER", "STUDENT"),
      defaultValue: "STUDENT",
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true, //PERMITE NULL
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true, //PERMITE NULL
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true, //PERMITE NULL
    },
    createdAt: {
      type: DataTypes.DATE, //tIMESTAMP
      allowNull: false,
      defaultValue: DataTypes.NOW, //DEFAUL CURRENT_TIMESTAMP
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    //timestamps: false,
  }
);

export default User;
