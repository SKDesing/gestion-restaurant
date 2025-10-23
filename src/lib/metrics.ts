// Small shim for recording metrics. Plug Prometheus client here later.
export function recordCounter(name: string, value = 1) {
  // No-op for now.
  return;
}
