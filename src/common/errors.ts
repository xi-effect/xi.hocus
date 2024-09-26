export class HocusPocusError extends Error {
  reason: string

  constructor(reason?: string) {
    super(reason)
    this.reason = reason || "Server Error"
  }
}

export function logServerError(message: any) {
  console.error(message)
}
