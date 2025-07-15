import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { nanoid } from 'nanoid'
import Fastify from 'fastify'

import { shortUrls } from './mongo.mjs'

const SHORT_URL_LENGTH = process.env.SHORT_URL_LENGTH || 12
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function build (opts = {}) {
  const fastify = Fastify({
    logger: opts.logger || false
  })

  fastify.get('/', async (request, reply) => {
    return { status: 'ok' }
  })

  // short url redirect page
  fastify.get('/:shortId', async (request, reply) => {
    const shortId = request.params.shortId

    const shortUrl = await shortUrls.findOne({ _id: shortId })

    if (!shortUrl) {
      return reply.status(404).send({ error: 'Short URL not found' })
    }

    let redirectHtml = readFileSync(join(__dirname, 'redirect.html'), 'utf8')

    // replace template variables, handle special characters
    redirectHtml = redirectHtml
      .replace(/\{\{TARGET_URL\}\}/g, shortUrl.url.replace(/'/g, "\\'"))
      .replace(/\{\{SHORT_ID\}\}/g, shortId)
      .replace(/\{\{ENCODED_URL\}\}/g, encodeURIComponent(shortUrl.url))

    reply.type('text/html').send(redirectHtml)
  })

  // API create short url
  fastify.post('/api/v1/short-urls', async (request, reply) => {
    const { url } = request.body

    if (!url) {
      return reply.status(400).send({ error: 'URL is required' })
    }

    // check if url is string
    if (typeof url !== 'string') {
      return reply.status(400).send({ error: 'URL must be a string' })
    }

    if (!url.startsWith('http')) {
      return reply.status(400).send({ error: 'URL must start with http' })
    }

    const shortId = nanoid(SHORT_URL_LENGTH)

    await shortUrls.insertOne({ _id: shortId, url })

    const result = {
      shortId,
      domain: DOMAIN,
      shortUrl: `${DOMAIN}/${shortId}`,
      url
    }

    return reply.status(201).send(result)
  })

  return fastify
}
