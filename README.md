## Project Structure

Dưới đây là sơ đồ cây cấu trúc các thư mục và file trong dự án (loại bỏ các file `.gitkeep`):

```text
.
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── .husky
│   └── pre-commit
├── .lintstagedrc.cjs
├── .prettierignore
├── .prettierrc
├── README.md
├── docs
│   ├── analysis and design
│   │   └── design-system.md
│   ├── api
│   │   └── auth.md
│   ├── guidelines
│   │   └── coding-conventions.md
│   ├── requirements
│   │   ├── use-case_diagram
│   │   │   ├── UC-01_Account.md
│   │   │   ├── UC-02_StudyPlanner.md
│   │   │   ├── UC-03_FocusSession.md
│   │   │   ├── UC-04_AIExaminer.md
│   │   │   ├── UC-05_Dashboard.md
│   │   │   └── UC-Overview.md
│   │   └── use-case_specification
│   │       ├── SPEC_AE-02_PhienKiemTra.md
│   │       ├── SPEC_AE-07_TruyNguocLoHong.md
│   │       ├── SPEC_DB-02_TuongTacDoThi.md
│   │       ├── SPEC_FS-01_ThucHienPhienHoc.md
│   │       └── SPEC_SP-01_TaoKeHoach.md
│   └── test
│       ├── bug-reports
│       │   └── bug-report-template.md
│       ├── test-cases
│       │   └── test-case-template.md
│       └── test-plan.md
├── pa
│   ├── pa0
│   │   ├── PA0-Group07.pdf
│   │   └── project-proposal.md
│   ├── pa1
│   │   ├── Project Plan
│   │   │   └── Software-Development-Plan_v1.1.pdf
│   │   ├── UI Protyping
│   │   │   ├── AI-Examiner_v0.1.png
│   │   │   ├── Create Study-Plan_v0.1.png
│   │   │   ├── Dashboard_v0.1.png
│   │   │   ├── Focus-Session_v0.1.png
│   │   │   ├── Interview-Results_v0.1.png
│   │   │   ├── Landing-Page_v0.1.png
│   │   │   └── Signin-&-Signup_v0.1.png
│   │   ├── Vision document
│   │   │   └── Vision-Document_v1.0.pdf
│   │   └── Weekly Report
│   │       ├── weekly_report_sprint1_week1.pdf
│   │       └── weekly_report_sprint1_week2.pdf
│   └── pa2
│       ├── Project plan
│       │   └── Software Development Plan v1.2.pdf
│       ├── Use-case model
│       │   ├── UC-00_Overview.png
│       │   ├── UC-01_AccountManagement.png
│       │   ├── UC-02_StudyPlanner.png
│       │   ├── UC-03_FocusSession.png
│       │   ├── UC-04_AIExaminer.png
│       │   └── UC-05_Dashboard.png
│       └── Use-case specification
│           └── Use-case_Specification.pdf
├── package-lock.json
├── package.json
└── src
    ├── client
    │   ├── .env.example
    │   ├── .gitignore
    │   ├── README.md
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock 2.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   │   ├── favicon.svg
    │   │   └── icons.svg
    │   ├── src
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── assets
    │   │   │   ├── hero.png
    │   │   │   ├── react.svg
    │   │   │   └── vite.svg
    │   │   ├── components
    │   │   │   ├── README.md
    │   │   │   ├── shared
    │   │   │   │   ├── AuthCard.tsx
    │   │   │   │   ├── ProtectedRoute.tsx
    │   │   │   │   └── layouts
    │   │   │   │       ├── AuthLayout.tsx
    │   │   │   │       └── MainLayout.tsx
    │   │   │   └── ui
    │   │   │       ├── button.tsx
    │   │   │       ├── card.tsx
    │   │   │       ├── checkbox.tsx
    │   │   │       ├── form.tsx
    │   │   │       ├── input.tsx
    │   │   │       ├── label.tsx
    │   │   │       ├── sidebar.tsx
    │   │   │       └── sonner.tsx
    │   │   ├── global.css
    │   │   ├── hooks
    │   │   │   ├── README.md
    │   │   │   └── useAuth.ts
    │   │   ├── lib
    │   │   │   ├── README.md
    │   │   │   ├── apiClient.ts
    │   │   │   ├── endpoints.ts
    │   │   │   └── utils.ts
    │   │   ├── main.tsx
    │   │   ├── pages
    │   │   │   ├── NotFoundPage.tsx
    │   │   │   ├── README.md
    │   │   │   ├── auth
    │   │   │   │   ├── LoginPage.tsx
    │   │   │   │   └── RegisterPage.tsx
    │   │   │   ├── dashboard
    │   │   │   │   └── DashboardPage.tsx
    │   │   │   ├── focus
    │   │   │   │   └── FocusPage.tsx
    │   │   │   ├── planning
    │   │   │   │   ├── CreatePlanPage.tsx
    │   │   │   │   └── PlansPage.tsx
    │   │   │   └── verify
    │   │   │       └── InterviewPage.tsx
    │   │   ├── types
    │   │   │   └── README.md
    │   │   └── vite-env.d.ts
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    └── server
        ├── .env.example
        ├── README.md
        ├── eslint.config.mjs
        ├── package-lock.json
        ├── package.json
        ├── prisma
        │   ├── migrations
        │   │   ├── 20260717153443_init
        │   │   │   └── migration.sql
        │   │   └── migration_lock.toml
        │   ├── schema.prisma
        │   └── seed.ts
        ├── prisma.config.ts
        ├── src
        │   ├── app.ts
        │   ├── config
        │   │   └── prisma.ts
        │   ├── controllers
        │   │   └── auth.controller.ts
        │   ├── middleware
        │   │   ├── auth.middleware.ts
        │   │   └── errorHandler.ts
        │   ├── routes
        │   │   └── auth.routes.ts
        │   ├── schemas
        │   │   └── auth.schema.ts
        │   ├── server.ts
        │   ├── services
        │   │   └── auth.service.ts
        │   ├── types
        │   │   ├── auth.types.ts
        │   │   └── express.d.ts
        │   └── utils
        │       └── jwt.ts
        └── tsconfig.json
```

### Chi tiết các thư mục chính

- **Các tệp tin cấu hình ở thư mục gốc (Root):**
  - `.github/workflows/ci.yml`: Thiết lập quy trình tích hợp liên tục (CI) tự động cho dự án.
  - `.husky/`: Thư mục quản lý các Git hooks (như tự động kiểm tra định dạng và lint code với `pre-commit` hook).
  - `.lintstagedrc.cjs`: Cấu hình lint-staged để chỉ chạy kiểm tra và định dạng trên các file đã được git stage.
  - `.prettierignore` & `.prettierrc`: Các tệp tin định cấu hình bỏ qua định dạng và luật format mã nguồn của Prettier.
  - `package.json` & `package-lock.json`: Quản lý dependencies, devDependencies và các scripts công cụ dùng chung cho toàn bộ dự án ở thư mục gốc.

- `/src`: Thư mục chứa mã nguồn của ứng dụng.
  - `/src/client`: Mã nguồn dự án FrontEnd (React + Vite + TypeScript).
    - `public/`: Chứa các tài nguyên tĩnh công khai (favicon, các icons SVG dùng chung).
    - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: Cấu hình Typescript cho client.
    - `vite.config.ts`: Cấu hình cho Vite bundler.
    - `src/`: Mã nguồn logic của FrontEnd client:
      - `assets/`: Chứa các hình ảnh, tài nguyên tĩnh được import trực tiếp trong code.
      - `components/`: Chứa các React components tái sử dụng:
        - `shared/`: Các components layout dùng chung (`AuthLayout.tsx`, `MainLayout.tsx`), Route bảo vệ (`ProtectedRoute.tsx`), và Component card wrapper cho phần xác thực (`AuthCard.tsx`).
        - `ui/`: Các UI base components từ shadcn/ui (như `button.tsx`, `card.tsx`, `checkbox.tsx`, `form.tsx`, `input.tsx`, `label.tsx`, `sidebar.tsx`, `sonner.tsx`).
      - `hooks/`: Chứa các custom hooks của React (như `useAuth.ts` quản lý trạng thái xác thực và gọi các tác vụ đăng nhập/đăng ký/đăng xuất).
      - `lib/`: Chứa các cấu hình thư viện và hàm tiện ích (`utils.ts`, `apiClient.ts` khởi tạo Axios instance tích hợp interceptors tự động gán token, `endpoints.ts` quản lý danh sách hằng số API endpoint).
      - `pages/`: Định nghĩa các trang giao diện của ứng dụng:
        - `auth/`: Các trang đăng nhập (`LoginPage.tsx`) và đăng ký (`RegisterPage.tsx`).
        - `dashboard/`: Trang bảng điều khiển chính (`DashboardPage.tsx`).
        - `focus/`: Trang tập trung học tập Pomodoro (`FocusPage.tsx`).
        - `planning/`: Trang tạo kế hoạch (`CreatePlanPage.tsx`) và danh sách kế hoạch (`PlansPage.tsx`).
        - `verify/`: Trang kiểm tra năng lực và phỏng vấn AI (`InterviewPage.tsx`).
        - `NotFoundPage.tsx`: Trang lỗi 404 hiển thị khi người dùng truy cập sai đường dẫn.
      - `types/`: Chứa các định nghĩa kiểu dữ liệu TypeScript cho phía client.
      - `global.css` & `App.css`: Quản lý styles toàn cục và style cho App component.
      - `App.tsx` & `main.tsx`: File cấu hình giao diện chính (chứa Router thiết lập layout) và điểm khởi tạo ứng dụng Client.

  - `/src/server`: Mã nguồn dự án Backend (Node.js + Express + TypeScript).
    - `prisma/`: Chứa cơ sở dữ liệu Prisma bao gồm schema, seed script và migrations.
      - `schema.prisma`: Prisma database schema định nghĩa 6 models chính phục vụ lưu trữ thông tin học tập, tài khoản, kế hoạch, phiên học.
      - `seed.ts`: Script khởi tạo dữ liệu mẫu cho database.
      - `migrations/`: Lịch sử các đợt cập nhật cơ sở dữ liệu (migration).
    - `prisma.config.ts`: Cấu hình Prisma 7 (datasource URL, seed command).
    - `tsconfig.json`: Cấu hình Typescript cho Backend server.
    - `src/`: Mã nguồn logic của Backend server:
      - `config/`: Cấu hình hệ thống (như Prisma Client singleton tại `prisma.ts`).
      - `controllers/`: Tiếp nhận requests, gọi services xử lý logic và trả về responses (ví dụ: `auth.controller.ts`).
      - `middleware/`: Middleware trung gian cho Express (như `errorHandler.ts` xử lý lỗi tập trung, `auth.middleware.ts` xác thực quyền truy cập qua JWT).
      - `routes/`: Định nghĩa các API endpoints của ứng dụng (ví dụ: `auth.routes.ts`).
      - `schemas/`: Các schema xác thực định dạng dữ liệu đầu vào (như Zod schema `auth.schema.ts` validate request body đăng nhập/đăng ký).
      - `services/`: Tầng xử lý logic nghiệp vụ chi tiết và tương tác database (ví dụ: `auth.service.ts`).
      - `types/`: Chứa các định nghĩa kiểu dữ liệu TypeScript dùng cho backend (`auth.types.ts`, `express.d.ts` bổ sung trường user vào Request).
      - `utils/`: Chứa các hàm tiện ích tái sử dụng (`jwt.ts` xử lý sinh và xác thực mã JWT token).
      - `app.ts`: Khởi tạo và thiết lập các cấu hình cho Express app.
      - `server.ts`: Điểm khởi chạy chính của HTTP server.

- `/docs`: Thư mục chứa tài liệu thiết kế, phân tích, kiểm thử và quản lý dự án.
  - `/docs/management/`: Kế hoạch dự án, báo cáo tiến độ.
  - `/docs/requirements/`: Yêu cầu dự án, tài liệu đặc tả (NFRs, Use case, Vision).
    - `use-case_diagram/`: Các tài liệu/sơ đồ Use-case tổng quan và chi tiết cho từng phân hệ.
    - `use-case_specification/`: Đặc tả chi tiết từng Use-case cốt lõi (như Phiên kiểm tra, Tạo kế hoạch, Thực hiện phiên học,...).
  - `/docs/analysis and design/`: Tài liệu phân tích, thiết kế hệ thống, UML, UI design.
    - `design-system.md`: Đặc tả hệ thống thiết kế (Design System) của dự án, bao gồm bảng màu (color palette), typography, các tokens và hướng dẫn giao diện (UI guidelines).
  - `/docs/api/`: Tài liệu đặc tả kỹ thuật chi tiết của các API endpoints (như tài liệu API Authentication `auth.md`).
  - `/docs/test/`: Kế hoạch kiểm thử, kịch bản kiểm thử, báo cáo lỗi.
  - `/docs/guidelines/`: Tài liệu hướng dẫn nội bộ, quy trình làm việc, tiêu chuẩn code.

- `/pa`: Thư mục chứa các bài tập dự án đã nộp theo từng giai đoạn học tập.
  - `pa/pa0/`: Bài tập nộp đề xuất dự án (Project proposal) và tài liệu định hướng.
  - `pa/pa1/`: Bài tập Sprint 1 (Kế hoạch dự án bản 1.1, thiết kế giao diện UI Prototyping, Vision Document và Báo cáo tuần).
  - `pa/pa2/`: Bài tập Sprint 2 (Kế hoạch dự án bản 1.2, sơ đồ Use-case và tài liệu Đặc tả Use-case đầy đủ).
