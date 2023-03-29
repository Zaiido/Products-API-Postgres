import Express from 'express'
import createHttpError from 'http-errors'
import ProductsModel from './model.js'

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const products = await ProductsModel.findAll()
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