import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const CategoriesModel = sequelize.define("category",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    })

export default CategoriesModel