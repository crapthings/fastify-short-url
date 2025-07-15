import dotenv from 'dotenv'

dotenv.config()

import { mongoClient } from './mongo.mjs'
import { build } from './app.mjs'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  const fastify = build()
  try {
    await fastify.listen({ port: PORT })
  } catch (err) {
    fastify.log.error(err)
    await mongoClient.close()
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await mongoClient.close()
  process.exit(0)
})

startServer()
