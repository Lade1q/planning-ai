## Project Structure

Dưới đây là sơ đồ cây cấu trúc các thư mục và file trong dự án (loại bỏ các file `.gitkeep`):

```text
.
├── .gitignore
├── README.md
├── docs
│   ├── analysis and design
│   │   └── design-system.md
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
└── src
    ├── client
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
    │   │   │   └── ui
    │   │   │       └── button.tsx
    │   │   ├── global.css
    │   │   ├── hooks
    │   │   │   └── README.md
    │   │   ├── lib
    │   │   │   ├── README.md
    │   │   │   └── utils.ts
    │   │   ├── main.tsx
    │   │   ├── pages
    │   │   │   └── README.md
    │   │   ├── types
    │   │   │   └── README.md
    │   │   └── vite-env.d.ts
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── tsconfig.tsbuildinfo
    │   └── vite.config.ts
    └── server
        ├── .env.example
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
        │   ├── middleware
        │   │   └── errorHandler.ts
        │   └── server.ts
        └── tsconfig.json
```

### Chi tiết các thư mục chính

- `/src`: Thư mục chứa mã nguồn của ứng dụng.
  - `/src/client`: Mã nguồn dự án FrontEnd (React + Vite + TypeScript).
    - `public/`: Chứa các tài nguyên tĩnh công khai (favicon, các icons SVG dùng chung).
    - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: Cấu hình Typescript cho client.
    - `vite.config.ts`: Cấu hình cho Vite bundler.
    - `src/`: Mã nguồn logic của FrontEnd client:
      - `assets/`: Chứa các hình ảnh, tài nguyên tĩnh được import trực tiếp trong code.
      - `components/`: Chứa các React components tái sử dụng (như nút bấm `ui/button.tsx`).
      - `hooks/`: Chứa các custom hooks của React.
      - `lib/`: Chứa các thư viện và hàm tiện ích (như `utils.ts` quản lý tailwind merge/classnames).
      - `pages/`: Định nghĩa các trang giao diện của ứng dụng.
      - `types/`: Chứa các định nghĩa kiểu dữ liệu TypeScript.
      - `global.css` & `App.css`: Quản lý styles toàn cục và style cho App component.
      - `App.tsx` & `main.tsx`: File cấu hình giao diện chính và điểm khởi tạo ứng dụng Client.
  - `/src/server`: Mã nguồn dự án Backend (Node.js + Express + TypeScript).
    - `prisma/`: Chứa cơ sở dữ liệu Prisma bao gồm schema, seed script và migrations.
      - `schema.prisma`: Prisma database schema chứa 6 models chính.
      - `seed.ts`: Script khởi tạo dữ liệu mẫu cho database.
      - `migrations/`: Lịch sử các đợt cập nhật cơ sở dữ liệu (migration).
    - `prisma.config.ts`: Cấu hình Prisma 7 (datasource URL, seed command).
    - `tsconfig.json`: Cấu hình Typescript cho Backend server.
    - `src/`: Mã nguồn logic của Backend server:
      - `config/`: Cấu hình hệ thống (như Prisma Client singleton tại `prisma.ts`).
      - `controllers/`: Xử lý đầu vào requests, gọi services và trả về responses.
      - `middleware/`: Middleware trung gian cho Express (như `errorHandler.ts` xử lý lỗi tập trung).
      - `routes/`: Định nghĩa các API endpoints của ứng dụng.
      - `services/`: Tầng xử lý logic nghiệp vụ và tương tác với cơ sở dữ liệu.
      - `utils/`: Chứa các hàm tiện ích tái sử dụng.
      - `app.ts`: Khởi tạo và thiết lập các cấu hình cho Express app.
      - `server.ts`: Điểm khởi chạy chính của HTTP server.
- `/docs`: Thư mục chứa tài liệu thiết kế, phân tích, kiểm thử và quản lý dự án.
  - `/docs/management/`: Kế hoạch dự án, báo cáo tiến độ.
  - `/docs/requirements/`: Yêu cầu dự án, tài liệu đặc tả (NFRs, Use case, Vision).
    - `use-case_diagram/`: Các tài liệu/sơ đồ Use-case tổng quan và chi tiết cho từng phân hệ.
    - `use-case_specification/`: Đặc tả chi tiết từng Use-case cốt lõi (như Phiên kiểm tra, Tạo kế hoạch, Thực hiện phiên học,...).
  - `/docs/analysis and design/`: Tài liệu phân tích, thiết kế hệ thống, UML, UI design.
    - `design-system.md`: Đặc tả hệ thống thiết kế (Design System) của dự án, bao gồm bảng màu (color palette), typography, các tokens và hướng dẫn giao diện (UI guidelines).
  - `/docs/test/`: Kế hoạch kiểm thử, kịch bản kiểm thử, báo cáo lỗi.
  - `/docs/guidelines/`: Tài liệu hướng dẫn nội bộ, quy trình làm việc, tiêu chuẩn code.
- `/pa`: Thư mục chứa các bài tập dự án đã nộp theo từng giai đoạn học tập.
  - `pa/pa0/`: Bài tập nộp đề xuất dự án (Project proposal) và tài liệu định hướng.
  - `pa/pa1/`: Bài tập Sprint 1 (Kế hoạch dự án bản 1.1, thiết kế giao diện UI Prototyping, Vision Document và Báo cáo tuần).
  - `pa/pa2/`: Bài tập Sprint 2 (Kế hoạch dự án bản 1.2, sơ đồ Use-case và tài liệu Đặc tả Use-case đầy đủ).
