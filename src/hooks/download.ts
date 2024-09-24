import { fetchPayload } from "@hocuspocus/server"

import { HocusPocusError, logServerError } from "../common/errors"
import { fetchStorageSafely } from "../common/fetcher"

export async function downloadYDocContent({ documentName }: fetchPayload): Promise<Uint8Array | null> {
  if (documentName.startsWith("test/")) return null

  const response = await fetchStorageSafely(`/ydocs/${documentName}/content/`)
  if (!response) {
    throw new HocusPocusError()
  }

  if (response.headers.get("content-length") === "0") {
    return null
  }

  const responseBody = response.body
  if (!responseBody) {
    logServerError("Download: body is not present")
    throw new HocusPocusError()
  }
  const data = await response.body.getReader().read()
  if (!data) {
    logServerError("Download: body read failed")
    throw new HocusPocusError()
  }
  const result = data.value
  if (!result) {
    logServerError("Download: body value is empty")
    throw new HocusPocusError()
  }
  return result
}
