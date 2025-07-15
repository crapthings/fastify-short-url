import 'dotenv/config'

import { mongoClient } from './mongo.js'
import { build } from './app.js'

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
