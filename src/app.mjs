// app.js
import Fastify from 'fastify'
import { shortUrls } from './mongo.mjs'
import { nanoid } from 'nanoid'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const SHORT_URL_LENGTH = process.env.SHORT_URL_LENGTH || 12
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function build(opts = {}) {
  const fastify = Fastify({
    logger: opts.logger || false
  })

  fastify.get('/', async (request, reply) => {
    return { status: 'ok' }
  })

  // 短链接重定向页面
  fastify.get('/:shortId', async (request, reply) => {
    const shortId = request.params.shortId

    const shortUrl = await shortUrls.findOne({ _id: shortId })

    if (!shortUrl) {
      return reply.status(404).send({ error: 'Short URL not found' })
    }

    let redirectHtml = readFileSync(join(__dirname, 'redirect.html'), 'utf8')

    // 替换模板变量，注意要处理特殊字符
    redirectHtml = redirectHtml
      .replace(/\{\{TARGET_URL\}\}/g, shortUrl.url.replace(/'/g, "\\'"))
      .replace(/\{\{SHORT_ID\}\}/g, shortId)
      .replace(/\{\{ENCODED_URL\}\}/g, encodeURIComponent(shortUrl.url))

    reply.type('text/html').send(redirectHtml)
  })

  // API 创建短链接
  fastify.post('/api/v1/short-urls', async (request, reply) => {
    const { url } = request.body
    const shortId = nanoid(SHORT_URL_LENGTH)
    await shortUrls.insertOne({ _id: shortId, url })
    return reply.status(201).send({ shortId, domain: DOMAIN, url: `${DOMAIN}/${shortId}` })
  })

  return fastify
}
