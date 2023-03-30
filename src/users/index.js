import Express from 'express'
import UsersModel from './model.js'

const usersRouter = Express.Router()


usersRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await UsersModel.create(request.body)
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


usersRouter.get("/", async (request, response, next) => {
    try {
        const users = await UsersModel.findAll()
        response.send(users)
    } catch (error) {
        next(error)
    }
})


usersRouter.get("/:userId", async (request, response, next) => {
    try {
        const user = await UsersModel.findByPk(request.params.userId)
        if (user) {
            response.send(user)
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))

        }
    } catch (error) {
        next(error)
    }
})


usersRouter.put("/:userId", async (request, response, next) => {
    try {
        const [numberOfUpdatedUsers, updatedUsers] = await UsersModel.update(request.body, { where: { id: request.params.userId }, returning: true })
        if (numberOfUpdatedUsers === 1) {
            response.send(updatedUsers[0])
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


usersRouter.delete("/:userId", async (request, response, next) => {
    try {
        const numberOfDeletedUsers = await UsersModel.destroy({ where: { id: request.params.userId } })
        if (numberOfDeletedUsers === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
        }

    } catch (error) {
        next(error)
    }
})


export default usersRouter