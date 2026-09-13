# Kubernetes probes and graceful shutdown example

A dependency-free Node.js example for a technical-writing tutorial. It separates liveness from readiness and stops accepting traffic on `SIGTERM` before closing the server.

## Run and verify

```bash
node test_server.mjs
PORT=8080 node server.js
curl -i http://127.0.0.1:8080/healthz
curl -i http://127.0.0.1:8080/readyz
```

`deployment.yaml` demonstrates probe wiring. Its image reference is deliberately a placeholder; it is not a deployable production manifest.

The `/slow` route exists only to make the graceful-drain integration test observable. It holds one response briefly so the test can prove that an in-flight request completes after `SIGTERM` while the server stops accepting new connections. It is not a health endpoint or production application pattern.

## Boundaries

This is an educational example only. It does not access a cluster, publish an image, store data, or make network calls beyond the local test server.
