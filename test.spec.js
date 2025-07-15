// app.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { build } from './src/app.mjs'

const TEST_URL = 'https://www.youtube.com/watch?v=RNJCfif1dPY'

describe('Short URL API', () => {
  let app

  beforeEach(async () => {
    app = build()
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
  })

  it('should return status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload)).toEqual({ status: 'ok' })
  })

  it('should create a short URL', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/short-urls',
      payload: {
        url: TEST_URL
      }
    })

    expect(response.statusCode).toBe(201)
    const result = JSON.parse(response.payload)
    expect(result.shortId).toBeDefined()
    expect(result.shortId).toHaveLength(12)
    expect(result.domain).toBeDefined()
    expect(result.url).toBeDefined()
    expect(result.url).toContain(result.shortId)
  })

  it('should return redirect page HTML for valid shortId', async () => {
    // create short url
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/short-urls',
      payload: {
        url: TEST_URL
      }
    })

    const { shortId } = JSON.parse(createResponse.payload)

    // visit short url, should return redirect page
    const redirectResponse = await app.inject({
      method: 'GET',
      url: `/${shortId}`
    })

    expect(redirectResponse.statusCode).toBe(200)
    expect(redirectResponse.headers['content-type']).toContain('text/html')

    // validate HTML content contains target URL and expected elements
    const html = redirectResponse.payload
    expect(html).toContain('redirecting...')
    expect(html).toContain('countdown')
    expect(html).toContain('manualLink')
    expect(html).toContain(TEST_URL)
  })

  it('should return 404 for non-existent shortId', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/nonexistent'
    })

    expect(response.statusCode).toBe(404)
    const result = JSON.parse(response.payload)
    expect(result.error).toBe('Short URL not found')
  })

  it('should handle special characters in URLs', async () => {
    const specialUrl = 'https://example.com/search?q=测试&category=科技'

    // create short url with special characters
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/short-urls',
      payload: {
        url: specialUrl
      }
    })

    const { shortId } = JSON.parse(createResponse.payload)

    // test visit short url
    const redirectResponse = await app.inject({
      method: 'GET',
      url: `/${shortId}`
    })

    expect(redirectResponse.statusCode).toBe(200)
    expect(redirectResponse.headers['content-type']).toContain('text/html')

    // validate special characters are handled correctly
    const html = redirectResponse.payload
    expect(html).toContain('redirecting...')
  })

  it('should handle URLs with single quotes', async () => {
    const urlWithQuotes = "https://example.com/test?name='john'"

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/short-urls',
      payload: {
        url: urlWithQuotes
      }
    })

    const { shortId } = JSON.parse(createResponse.payload)

    const redirectResponse = await app.inject({
      method: 'GET',
      url: `/${shortId}`
    })

    expect(redirectResponse.statusCode).toBe(200)
    expect(redirectResponse.headers['content-type']).toContain('text/html')

    // validate single quotes are escaped
    const html = redirectResponse.payload
    expect(html).toContain("\\'john\\'")
  })
})
