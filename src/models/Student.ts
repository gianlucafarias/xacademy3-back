import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Courses from "./Courses";
import User from "./User";
import Inscription from "./Inscription";

const Student = sequelize.define("Student", {
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
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Courses,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    qualification: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    studentCondition: {
        type: DataTypes.ENUM('EN_CURSO', 'APROBADO', 'DESAPROBADO'),
        defaultValue: 'EN_CURSO',
    },
    payment_status: {
        type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'ATRADADO'),
        defaultValue: 'PENDIENTE'
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
},
    {
        tableName: 'student',
        timestamps: true 
    });

// un estudiante tiene una curso
Student.belongsTo(Courses, {
    foreignKey: "course_id",
    as: "courses",
});
//un estudiante tiene un usuario
Student.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});


export default Student;