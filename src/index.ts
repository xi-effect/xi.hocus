import { Server } from "@hocuspocus/server"
import { Doc } from "yjs"

const server = Server.configure({
    name: "xi.hocus",
    port: 1234,
    timeout: 30000,
    debounce: 5000,
    maxDebounce: 30000,
    quiet: true,
})

server.listen()
