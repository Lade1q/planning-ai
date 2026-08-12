# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard/TC-DB-004.spec.ts >> TC-DB-004: Trạng thái không có plan và tất cả plan hết hạn >> b) Mọi plan active đã quá deadline: không được hiển thị Dashboard active bình thường
- Location: e2e/tests/dashboard/TC-DB-004.spec.ts:45:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('link', { name: 'Mở kế hoạch Plan P1', exact: true })
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Mở kế hoạch Plan P1', exact: true })
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | import { createTestPrismaClient, loginViaUi } from '../focus-session/focus-session-test-utils';
  3   | import { seedDashboardData } from './dashboard-test-utils';
  4   |
  5   | const prisma = createTestPrismaClient();
  6   | const MS_PER_DAY = 24 * 60 * 60 * 1000;
  7   |
  8   | test.beforeAll(async () => {
  9   |   await prisma.$connect();
  10  | });
  11  |
  12  | test.afterAll(async () => {
  13  |   await prisma.$disconnect();
  14  | });
  15  |
  16  | test.describe('TC-DB-004: Trạng thái không có plan và tất cả plan hết hạn', () => {
  17  |   test('a) Không có study plan: onboarding và CTA mở đúng luồng tạo plan', async ({ page }) => {
  18  |     const seed = await seedDashboardData(prisma, 'tc_db_004_a', { hasP1: false });
  19  |
  20  |     try {
  21  |       // 1. Đăng nhập Student chưa từng có study plan.
  22  |       await loginViaUi(page, seed.user.email);
  23  |       await expect(page).toHaveURL(/\/dashboard$/);
  24  |
  25  |       // 2. Dashboard hiển thị thông điệp không có plan và onboarding thay vì các khối active.
  26  |       await expect(
  27  |         page.getByText('Bạn chưa có kế hoạch ôn tập nào. Tạo một kế hoạch để bắt đầu ôn.', {
  28  |           exact: true,
  29  |         })
  30  |       ).toBeVisible();
  31  |       await expect(
  32  |         page.getByRole('heading', { name: 'Bắt đầu kế hoạch ôn tập đầu tiên', exact: true })
  33  |       ).toBeVisible();
  34  |       await expect(page.getByRole('heading', { name: 'Sắp đến hạn', exact: true })).toHaveCount(0);
  35  |
  36  |       // 3. CTA phải điều hướng đúng sang luồng tạo plan.
  37  |       await page.getByRole('link', { name: 'Tạo kế hoạch đầu tiên', exact: true }).click();
  38  |       await expect(page).toHaveURL('/plan/new');
  39  |     } finally {
  40  |       // 4. Dọn user test kể cả khi assertion/navigation thất bại.
  41  |       await prisma.user.delete({ where: { id: seed.user.id } });
  42  |     }
  43  |   });
  44  |
  45  |   test('b) Mọi plan active đã quá deadline: không được hiển thị Dashboard active bình thường', async ({
  46  |     page,
  47  |   }) => {
  48  |     const seed = await seedDashboardData(prisma, 'tc_db_004_b', {
  49  |       p1Deadline: new Date(Date.now() - 3 * MS_PER_DAY),
  50  |       hasP2: true,
  51  |       p2Deadline: new Date(Date.now() - MS_PER_DAY),
  52  |     });
  53  |
  54  |     try {
  55  |       // 1. Chờ response /plans thật trước khi kiểm tra trạng thái vắng plan trên UI.
  56  |       const plansResponse = page.waitForResponse(
  57  |         (response) =>
  58  |           new URL(response.url()).pathname === '/api/v1/plans' &&
  59  |           response.request().method() === 'GET' &&
  60  |           response.status() === 200
  61  |       );
  62  |
  63  |       // 2. Đăng nhập Student có toàn bộ plan active nhưng mọi deadline đều đã qua.
  64  |       await loginViaUi(page, seed.user.email);
  65  |       await expect(page).toHaveURL(/\/dashboard$/);
  66  |       await plansResponse;
  67  |       await Promise.any([
  68  |         page.getByRole('link', { name: 'Mở kế hoạch Plan P1', exact: true }).waitFor(),
  69  |         page.getByText('Chưa có kế hoạch nào đang hoạt động.', { exact: true }).waitFor(),
  70  |         page
  71  |           .getByRole('heading', { name: 'Bắt đầu kế hoạch ôn tập đầu tiên', exact: true })
  72  |           .waitFor(),
  73  |       ]);
  74  |
  75  |       // 3. Theo UC-16 E2, đây phải là gợi ý tạo plan mới chứ không phải catalog active bình thường.
  76  |       await expect(
  77  |         page.getByRole('link', { name: 'Mở kế hoạch Plan P1', exact: true })
> 78  |       ).toHaveCount(0);
      |         ^ Error: expect(locator).toHaveCount(expected) failed
  79  |       await expect(
  80  |         page.getByRole('link', { name: 'Mở kế hoạch Plan P2', exact: true })
  81  |       ).toHaveCount(0);
  82  |       await expect(page.getByRole('link', { name: /Tạo kế hoạch/i })).toBeVisible();
  83  |     } finally {
  84  |       // 4. Dọn dữ liệu test.
  85  |       await prisma.user.delete({ where: { id: seed.user.id } });
  86  |     }
  87  |   });
  88  |
  89  |   test('c) Có ít nhất một plan active deadline tương lai: không hiện onboarding/E2', async ({
  90  |     page,
  91  |   }) => {
  92  |     const seed = await seedDashboardData(prisma, 'tc_db_004_c');
  93  |
  94  |     try {
  95  |       // 1. Đăng nhập Student có P1 active deadline tương lai.
  96  |       await loginViaUi(page, seed.user.email);
  97  |       await expect(page).toHaveURL(/\/dashboard$/);
  98  |
  99  |       // 2. Dashboard hiển thị catalog active và không nhầm sang onboarding/E2.
  100 |       await expect(
  101 |         page.getByRole('heading', { name: 'Bắt đầu kế hoạch ôn tập đầu tiên', exact: true })
  102 |       ).toHaveCount(0);
  103 |       await expect(
  104 |         page.getByRole('link', { name: 'Mở kế hoạch Plan P1', exact: true })
  105 |       ).toBeVisible();
  106 |       await expect(page.getByRole('heading', { name: 'Sắp đến hạn', exact: true })).toBeVisible();
  107 |     } finally {
  108 |       // 3. Dọn dữ liệu test.
  109 |       await prisma.user.delete({ where: { id: seed.user.id } });
  110 |     }
  111 |   });
  112 | });
  113 |
```
