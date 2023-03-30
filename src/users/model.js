import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const UsersModel = sequelize.define("user",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    })

export default UsersModel