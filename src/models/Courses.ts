import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";

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
      type: DataTypes.ENUM('PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDIENTE', 'ACTIVO', 'FINALIZADO'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CoursesCategory',
        key: 'id',
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Teacher',
        key: 'id',
      }
    },
    image_url:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "courses",
    timestamps:true,
  }
);

interface Models{
  CoursesCategory: any;
  Teacher: any;
}

Courses.associate = (models: Models) =>{
  Courses.belongsTo(models.CoursesCategory, {
    foreignKey: 'category_id',
    as: 'category',
  });
  Courses.belongsTo(models.Teacher, {
    foreignKey: 'teacher_id',
    as: 'teacher',
  });
}

export default Courses;
