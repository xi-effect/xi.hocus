import type { storePayload } from "@hocuspocus/server"
import { gzipSync } from "zlib"

import { logServerError } from "../common/errors"
import { fetchStorageSafely } from "../common/fetcher"

export async function storeYDocContent({ documentName, state }: storePayload): Promise<void> {
  if (documentName.startsWith("test/")) return

  let compressed: Buffer
  try {
    compressed = gzipSync(state)
  } catch (e) {
    logServerError(e)
    return
  }

  await fetchStorageSafely(
    `/ydocs/${documentName}/content/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "gzip",
        "X-Size-Bytes": String(state.length),
      },
      body: new Uint8Array(compressed),
    }
  )
}
