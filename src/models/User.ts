const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "TEACHER", "STUDENT"),
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
    createAt: {
      type: DataTypes.DATE, //tIMESTAMP
      allowNull: false,
      defaultValue: DataTypes.NOW, //DEFAUL CURRENT_TIMESTAMP
    },
    updateAt: {
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
