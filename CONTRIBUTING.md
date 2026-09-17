# Contributing

Thank you for improving the Traditional Yangzhai Feng Shui Analysis System. Keep changes focused on the existing cultural-study and spatial-planning scope.

## Before opening a pull request

```sh
npm ci
npm run lint
npm test
npm run build
npm run security
```

Explain the user-facing or maintenance benefit, include regression coverage for behavior changes, and update documentation when the runtime or security boundary changes. Do not commit `.env` files, API keys, generated build output, or private user data.

## Pull requests

Use a focused branch and describe the problem, the change, and the verification results. Keep API behavior backward-compatible unless the pull request documents the migration. New dependencies need a maintenance, license, security, and bundle-size justification.
