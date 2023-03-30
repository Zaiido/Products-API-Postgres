import sequelize from "../db.js";
import { DataTypes } from "sequelize";


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


export default ReviewsModel