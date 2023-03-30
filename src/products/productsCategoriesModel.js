import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const ProductsCategoriesModel = sequelize.define("productCategory",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        }
    })

export default ProductsCategoriesModel