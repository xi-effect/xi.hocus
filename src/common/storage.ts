import { randomUUID } from "crypto"
import { mkdir, readFile, rename, unlink, writeFile } from "fs/promises"
import { dirname, join } from "path"
import { promisify } from "util"
import { gunzip, gzip } from "zlib"

const gzipAsync: (buffer: Buffer) => Promise<Buffer> = promisify(gzip)
const gunzipAsync: (buffer: Buffer) => Promise<Buffer> = promisify(gunzip)

const storageRoot: string = join(process.cwd(), "storage")

function getYDocContentPath(documentName: string): string {
  const yDocId: string = documentName.replaceAll("-", "").toLowerCase()
  return join(storageRoot, "ydocs", yDocId.slice(0, 2), yDocId.slice(2, 4), yDocId)
}

export async function writeYDocContent(documentName: string, content: Buffer): Promise<void> {
  const path: string = getYDocContentPath(documentName)
  const compressedContent: Buffer = await gzipAsync(content)
  const temporaryPath: string = `${path}.${randomUUID()}.tmp`

  await mkdir(dirname(path), { recursive: true })
  try {
    await writeFile(temporaryPath, compressedContent)
    await rename(temporaryPath, path)
  } catch (e) {
    await unlink(temporaryPath).catch(() => undefined)
    throw e
  }
}

export async function readYDocContent(documentName: string): Promise<Uint8Array | null> {
  const path: string = getYDocContentPath(documentName)

  let compressedContent: Buffer
  try {
    compressedContent = await readFile(path)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return null
    }
    throw e
  }

  return await gunzipAsync(compressedContent)
}
