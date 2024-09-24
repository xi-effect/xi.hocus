import { onAuthenticatePayload } from "@hocuspocus/server"
import { IncomingHttpHeaders } from "http"

import { HocusPocusError, logServerError } from "../common/errors"
import { fetchStorage } from "../common/fetcher"

function getSimpleHeaderValue(headers: IncomingHttpHeaders, name: string): string {
  const header = headers[name]
  if (typeof header === "string") {
    return header
  }
  logServerError(`Invalid auth header in ${name}: ${header}`)
  throw new HocusPocusError("Proxy Error")
}

type ProxyAuthHeadersT = {
  "X-Session-ID": string,
  "X-User-ID": string,
  "X-Username": string,
}

function parseProxyHeaders(requestHeaders: IncomingHttpHeaders): ProxyAuthHeadersT {
  return {
    "X-Session-ID": getSimpleHeaderValue(requestHeaders, "X-Session-ID"),
    "X-User-ID": getSimpleHeaderValue(requestHeaders, "X-User-ID"),
    "X-Username": getSimpleHeaderValue(requestHeaders, "X-Username"),
  }
}

export async function verifyYDocAccess(
  { documentName, requestHeaders, connection }: onAuthenticatePayload
): Promise<{} | ProxyAuthHeadersT> {
  if (documentName.startsWith("test/")) return {}

  const proxyAuthHeaders = parseProxyHeaders(requestHeaders)

  if (documentName.includes("/")) {
    throw new HocusPocusError("Invalid document name")
  }

  const response = await fetchStorage(
    `/ydocs/${documentName}/access-level/`,
    { headers: proxyAuthHeaders }
  )

  if (response?.ok) {
    const data = await response.json()
    if (data === "read-write") {
      return proxyAuthHeaders
    } else if (data === "read-only") {
      connection.readOnly = true
      return proxyAuthHeaders
    } else {
      throw new HocusPocusError("Access Denied")
    }
  } else if (response?.status === 404) {
    throw new HocusPocusError("YDoc not found")
  } else {
    throw new HocusPocusError()
  }
}
