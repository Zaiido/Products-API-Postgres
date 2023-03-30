import Express from 'express'
import createHttpError from 'http-errors'
import UsersModel from '../users/model.js'
import ReviewsModel from './model.js'

const reviewsRouter = Express.Router()

reviewsRouter.post("/:productId/reviews", async (request, response, next) => {
    try {
        const { id } = await ReviewsModel.create({ ...request.body, productId: request.params.productId })
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


reviewsRouter.get("/:productId/reviews", async (request, response, next) => {
    try {
        const reviews = await ReviewsModel.findAll({ where: { productId: request.params.productId }, include: [{ model: UsersModel, attributes: ["name", "surname"] }] })
        response.send(reviews)
    } catch (error) {
        next(error)
    }
})


reviewsRouter.get("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const review = await ReviewsModel.findByPk(request.params.reviewId)
        if (review) {
            response.send(review)
        } else {
            next(createHttpError(404, `Review with id ${request.params.reviewId} was not found!`))

        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.put("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const [numberOfUpdatedReviews, updatedReviews] = await ReviewsModel.update(request.body, { where: { id: request.params.reviewId }, returning: true })
        if (numberOfUpdatedReviews === 1) {
            response.send(updatedReviews[0])
        } else {
            next(createHttpError(404, `Review with id ${request.params.reviewId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


reviewsRouter.delete("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const numberOfDeletedReviews = await ReviewsModel.destroy({ where: { id: request.params.reviewId } })
        if (numberOfDeletedReviews === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `Review with id ${request.params.reviewId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


export default reviewsRouter