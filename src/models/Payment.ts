import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Student from "./Student";
import Courses from "./Courses";

const Payment = sequelize.define(
  "Payment",
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
      onDelete: "CASCADE",
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDIENTE", "PAGADO", "ATRASADO"),
      defaultValue: "PENDIENTE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payment",
    timestamps: true,
  }
);
// un Pago tiene una curso
Payment.belongsTo(Courses, {
  foreignKey: "course_id",
  as: "courses",
});
//un Pago tiene un estudiante
Payment.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

export default Payment;