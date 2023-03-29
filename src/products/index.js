import Express from 'express'
import createHttpError from 'http-errors'
import ProductsModel from './model.js'
import { Op } from 'sequelize'

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const query = {}
        if (request.query.name) query.name = { [Op.iLike]: `%${request.query.name}%` }
        if (request.query.description) query.description = { [Op.iLike]: `%${request.query.description}%` }
        if (request.query.minPrice && request.query.maxPrice) query.price = { [Op.between]: [request.query.minPrice, request.query.maxPrice] }
        if (request.query.category) query.category = { [Op.iLike]: `%${request.query.category}%` }
        const products = await ProductsModel.findAll({
            where: { ...query },
            order: [request.query.columnToSort && request.query.sortDirection ? [request.query.columnToSort, request.query.sortDirection] : ["price", "ASC"]],
            offset: request.query.offset,
            limit: request.query.limit
        })
        response.send(products)
    } catch (error) {
        next(error)
    }
})


productsRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await ProductsModel.create(request.body)
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