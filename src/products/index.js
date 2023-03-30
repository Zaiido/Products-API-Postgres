import Express from 'express'
import createHttpError from 'http-errors'
import ProductsModel from './model.js'
import { Op } from 'sequelize'
import ProductsCategoriesModel from './productsCategoriesModel.js'
import CategoriesModel from '../categories/model.js'
import ReviewsModel from '../reviews/model.js'
import UsersModel from '../users/model.js'
import q2s from 'query-to-sequelize'

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const seqQuery = q2s(request.query)
        let whereClause = {};


        if (seqQuery.criteria.minPrice && seqQuery.criteria.maxPrice) {
            whereClause.price = { [Op.between]: [seqQuery.criteria.minPrice, seqQuery.criteria.maxPrice] };
        }

        if (seqQuery.criteria.search) {
            whereClause = {
                ...whereClause,
                ...{ [Op.or]: [{ name: { [Op.iLike]: `%${seqQuery.criteria.search}%` } }, { description: { [Op.iLike]: `%${seqQuery.criteria.search}%` } }] }
            }
        }

        if (Object.keys(whereClause).length === 0) {
            whereClause = {
                ...seqQuery.criteria
            }
        }


        const { count, rows } = await ProductsModel.findAndCountAll({
            where: {
                ...whereClause
            },
            order: seqQuery.options.sort,
            offset: seqQuery.options.skip,
            limit: seqQuery.options.limit,
            include: [
                { model: CategoriesModel, attributes: ["name"], through: { attributes: [] } },
                { model: ReviewsModel, include: [{ model: UsersModel, attributes: ["name", "surname"] }], attributes: ["content"] }]
        })


        response.send(
            {
                total: count,
                pages: Math.ceil(count / seqQuery.limit),
                links: seqQuery.links(`${process.env.BE_URL}/products`, count),
                products: rows
            })
    } catch (error) {
        next(error)
    }
})


productsRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await ProductsModel.create(request.body)
        if (request.body.categories) {
            await ProductsCategoriesModel.bulkCreate(
                request.body.categories.map(category => {
                    return { productId: id, categoryId: category }
                })
            )
        }
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})

// ADD CATEGORY TO EXISTING PRODUCT
productsRouter.post("/:productId/categories", async (request, response, next) => {
    try {
        const { id } = await ProductsCategoriesModel.create({ productId: request.params.productId, categoryId: request.body.categoryId })
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


productsRouter.get("/:productId", async (request, response, next) => {
    try {
        const product = await ProductsModel.findByPk(request.params.productId)
        if (product) {
            response.send(product)
        } else {
            next(createHttpError(404, `Product with id ${request.params.productId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


productsRouter.put("/:productId", async (request, response, next) => {
    try {
        const [numberOfUpdatedProducts, updatedProducts] = await ProductsModel.update(request.body, { where: { id: request.params.productId }, returning: true })
        if (numberOfUpdatedProducts === 1) {
            response.send(updatedProducts[0])
        } else {
            next(createHttpError(404, `Product with id ${request.params.productId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


productsRouter.delete("/:productId", async (request, response, next) => {
    try {
        const numberOfDeletedProducts = await ProductsModel.destroy({ where: { id: request.params.productId } })
        if (numberOfDeletedProducts === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `Product with id ${request.params.productId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default productsRouter