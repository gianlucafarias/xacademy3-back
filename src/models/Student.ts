const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
import Courses from "./Courses";
import User from "./User";

const Student = sequelize.define("Student", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    course_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Courses,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    qualification:{
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    studentCondition:{
        type: DataTypes.ENUN('EN_CURSO', 'APROBADO', 'DESAPROBADO'),
       defaultValue: 'EN_CURSO', 
    },
    payment_status:{
        type: DataTypes.ENUN('PENDIENTE', 'PAGADO', 'ATRADADO'),
        defaultValue: 'PENDIENTE'
    },
    certificate_id:{//falta la tabla referenciada
        type: DataTypes.INTEGER,
        allowNull: true
    },
    attendece_id:{//falta la tabla referenciada
        type: DataTypes.INTEGER,
        allowNull: true
    },
},
{
    tableName: 'student'
});

export default Student;