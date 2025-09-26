// This file is kept for backward compatibility and Docker build context.
// The TypeScript source is in server.ts and compiles to dist/server.js.
// If you are running locally without Docker, use:
//   npm run dev
// In production/Docker, the CMD runs node dist/server.js.
import("./dist/server.js");
