import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 configuration file.
 * Quản lý database URL cho migration và CLI commands.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --compiler-options {"rootDir":".","module":"commonjs"} prisma/seed.ts',
  },
  datasource: {
    // `migrate` và `db pull` cần một kết nối giữ được session: chúng khoá bằng
    // advisory lock, thứ biến mất ngay khi transaction pooler (cổng 6543) trả
    // connection về pool. Ai để DATABASE_URL ở 6543 thì khai thêm DIRECT_URL trỏ
    // session pooler (5432); ai đã dùng 5432 cho cả hai thì không cần đặt gì.
    // Đọc thẳng process.env chứ không dùng env(): env() ném lỗi khi biến trống,
    // nên nó không dùng làm vế trái của `||` được.
    url: process.env.DIRECT_URL || env('DATABASE_URL'),
  },
});
