import { fetchPayload } from "@hocuspocus/server"

import { HocusPocusError } from "../common/errors"
import { fetchStorageSafely } from "../common/fetcher"

export async function downloadYDocContent({ documentName }: fetchPayload): Promise<Uint8Array | null> {
  if (documentName.startsWith("test/")) return null

  const response = await fetchStorageSafely(`/ydocs/${documentName}/content/`)
  if (!response) {
    throw new HocusPocusError()
  }

  const arrayBuffer = await response.arrayBuffer()

  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    return null
  }

  return new Uint8Array(arrayBuffer)
}
