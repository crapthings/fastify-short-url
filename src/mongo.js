import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/fastify-short-url'

export const mongoClient = new MongoClient(MONGO_URL)

export const shortUrls = mongoClient.db().collection('short-urls')

mongoClient.connect().then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.error(err)
})
