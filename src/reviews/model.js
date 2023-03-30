import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            type: DataTypes.STRING()
        }
    })


UsersModel.hasMany(ReviewsModel)
ReviewsModel.belongsTo(UsersModel, { foreignKey: { name: "userId", allowNull: false }, })

export default ReviewsModel