import Express from 'express'
import createHttpError from 'http-errors'
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