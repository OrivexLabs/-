# Security policy

## Scope and boundary

The optional `/api/gemini/analyze` endpoint accepts user-provided housing descriptions and sends them to the configured Gemini API. The server keeps the Gemini key in `GEMINI_API_KEY`, validates request and model-response shapes, limits request size, and does not execute model output as code or shell commands.

The current application has no user authentication, account isolation, persistent storage, or distributed rate limiter. Its in-memory limit is a single-process abuse-control measure, not an authorization boundary. Do not deploy the endpoint publicly without an authenticated gateway and operational monitoring appropriate to the deployment.

## Reporting a vulnerability

Please report suspected vulnerabilities privately through GitHub's private vulnerability reporting/security advisory channel for this repository, or contact the maintainers privately through GitHub if that channel is unavailable. Include a minimal reproduction, affected path or version, impact, and any required configuration. Do not publish secrets, personal data, or an exploit in a public issue.

We will acknowledge a private report when reviewed and coordinate a fix or mitigation before public disclosure where practical.
