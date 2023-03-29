import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const ProductsModel = sequelize.define("product",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        }
    })

export default ProductsModel