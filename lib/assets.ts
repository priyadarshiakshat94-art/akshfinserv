import "server-only";
import fs from "node:fs";
import path from "node:path";

// Lets pages fall back gracefully until real images land in /public.
export const publicFileExists = (p: string | undefined) =>
  !!p && fs.existsSync(path.join(process.cwd(), "public", p));
