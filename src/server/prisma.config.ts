import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 configuration file.
 * Quan ly database URL cho migration va CLI commands.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --compiler-options {\"rootDir\":\".\",\"module\":\"commonjs\"} prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
