// Replace this with your actual session cookie value:
const SESSION_COOKIE =
  '53616c7465645f5f8175d3dbb6bd3a80431709006f5195c897078be4463b3404d2051543ef1b3c774b62b7a82fe58c6a0c9d262418c86e38ffe6b21f706093f7'

export async function getInputData(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Cookie: `session=${SESSION_COOKIE}`,
      'User-Agent': 'github.com/yourusername - personal use', // Good practice
    },
  })

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`)
  }

  const data = await response.text()
  return data.trim()
}
