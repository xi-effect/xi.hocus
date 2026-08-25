import { logServerError } from "./errors"

const back2BaseUrl = process.env.back_2__base_url || "http://localhost:5000"
const back2BasePath = "/internal/content-service"
const back2ApiKey = process.env.back_2__api_key || "local"

export async function fetchStorage(path: string, init?: RequestInit): Promise<Response | undefined> {
  try {
    return await fetch(
      new URL(back2BasePath + path, back2BaseUrl),
      {
        ...init,
        headers: {
          "X-Api-Key": back2ApiKey,
          ...init?.headers,
        },
      }
    )
  } catch (e) {
    logServerError(e)
    return undefined
  }
}

export async function fetchStorageSafely(path: string, init?: RequestInit): Promise<Response | undefined> {
  const response = await fetchStorage(path, init)
  if (response && !response.ok) {
    logServerError(response)
    return undefined
  }
  return response
}
