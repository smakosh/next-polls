import { loadEnvConfig } from "@next/env";

if (typeof window === "undefined") {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
}
