// utils/sse.ts
export type SSEEmit = (type: "progress" | "final" | "error", payload: any) => void;

export const createSSEEmitter = (res: any): SSEEmit => {
  return (type, payload) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
};
