import { storePayload } from "@hocuspocus/server"

import { fetchStorageSafely } from "../common/fetcher"

export async function storeYDocContent({ documentName, state }: storePayload): Promise<void> {
  if (documentName.startsWith("test/")) return

  await fetchStorageSafely(
    `/ydocs/${documentName}/content/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream"
      },
      body: state,
    }
  )
}
