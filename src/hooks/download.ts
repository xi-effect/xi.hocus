import type { fetchPayload } from "@hocuspocus/server"

import { HocusPocusError, logServerError } from "../common/errors"
import { fetchStorageSafely } from "../common/fetcher"

export async function downloadYDocContent({ documentName }: fetchPayload): Promise<Uint8Array | null> {
  if (documentName.startsWith("test/")) return null

  const response = await fetchStorageSafely(`/ydocs/${documentName}/content/`)
  if (!response) {
    throw new HocusPocusError()
  }

  const contentLength = response.headers.get("content-length")
  if (contentLength === "0") {
    return null
  }

  const buf = await response.arrayBuffer().catch(() => null)
  if (!buf) {
    logServerError("Download: failed to read arrayBuffer")
    throw new HocusPocusError()
  }

  return new Uint8Array(buf)
}
