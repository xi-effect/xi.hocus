import type { storePayload } from "@hocuspocus/server"

import { HocusPocusError, logServerError } from "../common/errors"
import { fetchStorageSafely } from "../common/fetcher"
import { writeYDocContent } from "../common/storage"

export async function storeYDocContent({ documentName, state }: storePayload): Promise<void> {
  if (documentName.startsWith("test/")) return

  try {
    await writeYDocContent(documentName, state)
  } catch (e) {
    logServerError(e)
    throw new HocusPocusError()
  }

  void fetchStorageSafely(
    `/ydocs/${documentName}/content-meta/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ size_bytes: state.length }),
    }
  )
}
