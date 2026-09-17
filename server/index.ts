/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { startServer } from '../server.ts';

void startServer().catch((error: unknown) => {
  console.error('[server] startup failed');
  if (error instanceof Error) console.error(error.message);
  process.exitCode = 1;
});
