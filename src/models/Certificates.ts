import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Student from "./Student";
import Courses from "./Courses";

const Certificate = sequelize.define("Certificate", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    issue_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
    ,
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Student,
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
    },
    status: {
        type: DataTypes.ENUM("PENDIENTE", "EMITIDO", "REVOCADO"),
        defaultValue: "PENDIENTE",
    }
},
    {
        tableName: "certificate",
        timestamps: false,
    }
);

// un estudiante tiene una curso
Certificate.belongsTo(Courses, {
    foreignKey: "course_id",
    as: "courses",
  });
  //un estudiante tiene un estudiante
  Certificate.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
  });

export default Certificate;