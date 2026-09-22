import type { fetchPayload } from "@hocuspocus/server"

import { HocusPocusError, logServerError } from "../common/errors"
import { readYDocContent } from "../common/storage"

export async function downloadYDocContent({ documentName }: fetchPayload): Promise<Uint8Array | null> {
  if (documentName.startsWith("test/")) return null

  try {
    return await readYDocContent(documentName)
  } catch (e) {
    logServerError(e)
    throw new HocusPocusError()
  }
}
