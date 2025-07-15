// test url
const TARGET_URL = 'https://www.youtube.com/watch?v=RNJCfif1dPY'
// change this to your own domain or dev server
const API_BASE = 'http://localhost:3000'

async function createShortUrl() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/short-urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: TARGET_URL
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log(result.shortUrl)
  } catch (error) {
    console.error('failed to create short url:', error.message)
  }
}

createShortUrl()
