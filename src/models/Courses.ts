import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Teacher from "./Teacher";
import CoursesCategory from "./CoursesCategory"; 

const Courses = sequelize.define(
  "Courses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    },
    modalidad: {
      type: DataTypes.ENUM("PRESENCIAL", "VIRTUAL", "HÍBRIDO"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDIENTE", "ACTIVO", "FINALIZADO"),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: "https://t4.ftcdn.net/jpg/05/17/53/57/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg",
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses_category",
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "teacher",
        key: "id",
      },
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);


// un curso tiene una categoria
Courses.belongsTo(CoursesCategory, {
  foreignKey: "category_id",
  as: "courses_category",
});
//un curso tiene un profesor
Courses.belongsTo(Teacher, {
  foreignKey: "teacher_id",
  as: "teacher",
});



export default Courses;
