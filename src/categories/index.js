import Express from 'express'
import CategoriesModel from './model.js'

const categoriesRouter = Express.Router()


categoriesRouter.get("/", async (request, response, next) => {
    try {
        const categories = await CategoriesModel.findAll()
        response.send(categories)
    } catch (error) {
        next(error)
    }
})


categoriesRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await CategoriesModel.create(request.body)
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


// POST SOME CATEGORIES
categoriesRouter.post("/bulk", async (request, response, next) => {
    try {
        const categories = await CategoriesModel.bulkCreate(request.body)
        response.send(categories.map(c => c.id))
    } catch (error) {
        next(error)
    }
})

export default categoriesRouter