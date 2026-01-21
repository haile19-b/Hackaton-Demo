export type SSEEvent =
  | { type: "step"; node: string; message: string; timestamp: number }
  | { type: "error"; error: string; timestamp: number }
  | { type: "done"; result: any; timestamp: number };
