import { DataTypes } from "sequelize";
import { sequelize } from "../../config/dbConfig";
import Courses from "./Courses";

const Class = sequelize.define(
    "Class",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        class_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Courses,
                key: "id",
            },
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
        tableName: "class",
        timestamps: true,
    }
)
Class.belongsTo(Courses, {
    foreignKey: "course_id",
    as: "course",
});
export default Class;