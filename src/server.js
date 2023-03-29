import Express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { badRequestErrorHandler, genericErrorHandler, notfoundErrorHandler } from './errorHandlers.js'
import { pgConnect } from './db.js'
import productsRouter from './products/index.js'

const server = Express()
const port = process.env.PORT

server.use(cors())
server.use(Express.json())


server.use("/products", productsRouter)


server.use(badRequestErrorHandler)
server.use(notfoundErrorHandler)
server.use(genericErrorHandler)

await pgConnect()

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
})