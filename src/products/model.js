import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import ProductsCategoriesModel from "./productsCategoriesModel.js";
import CategoriesModel from "../categories/model.js";
import ReviewsModel from "../reviews/model.js";

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



ProductsModel.belongsToMany(CategoriesModel, {
    through: ProductsCategoriesModel,
    foreignKey: { name: "productId", allowNull: false }
})

CategoriesModel.belongsToMany(ProductsModel, {
    through: ProductsCategoriesModel,
    foreignKey: { name: "categoryId", allowNull: false }
})



ProductsModel.hasMany(ReviewsModel)
ReviewsModel.belongsTo(ProductsModel, { foreignKey: { name: "productId", allowNull: false } })


export default ProductsModel