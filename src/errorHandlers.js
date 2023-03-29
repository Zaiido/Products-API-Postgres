import { ValidationError } from "sequelize"

export const badRequestErrorHandler = (error, request, response, next) => {
    if (error.status === 400) {
        if (error.errorsList) {
            response.status(400).send({ message: error.message, errorsList: error.errorsList.map(e => e.msg) })

        } else {
            response.status(400).send({ message: error.message })
        }
    } else if (error instanceof ValidationError) {
        response.status(400).send({ message: error.errors.map(e => e.message) })
    }
    else {
        next(error)
    }
}

export const notfoundErrorHandler = (error, request, response, next) => {
    if (error.status === 404) {
        response.status(404).send({ message: error.message })
    } else {
        next(error)
    }
}


export const genericErrorHandler = (error, request, response, next) => {
    console.log("ERROR:", error)
    response.status(500).send({ message: "Something went wrong! Please try again later" })
}