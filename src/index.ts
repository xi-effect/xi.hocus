import { Database } from "@hocuspocus/extension-database"
import { Logger } from "@hocuspocus/extension-logger"
import { Server } from "@hocuspocus/server"

import { verifyYDocAccess } from "./hooks/access"
import { downloadYDocContent } from "./hooks/download"
import { storeYDocContent } from "./hooks/store"

const server = new Server({
  name: "xi.hocus",
  port: 1234,
  timeout: 60000,
  debounce: 5000,
  maxDebounce: 30000,
  quiet: true,
  onAuthenticate: verifyYDocAccess,
  extensions: [
    new Logger(
      {
        onChange: process.env.enable_change_logs === "true",
      }
    ),
    new Database({
      fetch: downloadYDocContent,
      store: storeYDocContent,
    }),
  ],
})

server.listen()
