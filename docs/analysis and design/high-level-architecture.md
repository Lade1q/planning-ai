# Kiến trúc Tổng quan Hệ thống - Planning AI

> **Phiên bản:** v0.1 (Sơ khởi)
> **Ngày tạo:** 2026-06-27
> **Tác giả:** System Architect
> **Trạng thái:** Bản nháp - Sẽ được tinh chỉnh (refined) trong Sprint 2-3

---

## 1. Tổng quan

Planning AI là một ứng dụng web kiến trúc **Client-Server (SPA + REST API)**, hỗ trợ người dùng chuyển đổi từ ý định sang hành động thông qua quy trình **Plan - Focus - Verify**, tận dụng AI để cá nhân hóa trải nghiệm.

**Quy mô MVP:** 12 màn hình cốt lõi | **Đối tượng:** Sinh viên, Nhân viên văn phòng | **Nền tảng:** Desktop Web (Chrome/Edge/Firefox)

---

## 2. Sơ đồ Kiến trúc Tổng quan

```mermaid
graph TB
    subgraph CLIENT["FRONTEND - Browser SPA"]
        direction TB
        UI["React + TypeScript + Vite"]
        STYLE["Tailwind CSS + shadcn/ui"]
        ROUTER["React Router"]
        HTTP["Axios HTTP Client"]
        UI --> STYLE
        UI --> ROUTER
        UI --> HTTP
    end

    subgraph SERVER["BACKEND - API Server"]
        direction TB
        EXPRESS["Express.js Server"]
        AUTH_MW["Auth Middleware - JWT"]
        CONTROLLERS["Route Controllers"]
        SERVICES["Business Logic Services"]
        PRISMA["Prisma ORM Client"]
        EXPRESS --> AUTH_MW
        AUTH_MW --> CONTROLLERS
        CONTROLLERS --> SERVICES
        SERVICES --> PRISMA
    end

    subgraph DATA["DATABASE"]
        direction TB
        PG["PostgreSQL"]
    end

    subgraph EXTERNAL["DICH VU BEN NGOAI"]
        direction TB
        GEMINI["Gemini API - Google AI"]
    end

    HTTP -- "REST API\n/api/v1/*\nJSON + JWT Bearer" --> EXPRESS
    PRISMA -- "Prisma Client\nQuery/Mutation" --> PG
    SERVICES -- "HTTP Request\nPrompt + Multimodal" --> GEMINI
    GEMINI -- "AI Response\nKe hoach / Phan loai / Kiem tra" --> SERVICES

    style CLIENT fill:#e8f4fd,stroke:#2196F3,stroke-width:2px
    style SERVER fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    style DATA fill:#fff3e0,stroke:#FF9800,stroke-width:2px
    style EXTERNAL fill:#fce4ec,stroke:#E91E63,stroke-width:2px
```

---

## 3. Sơ đồ Luồng Dữ liệu Chính

```mermaid
sequenceDiagram
    participant U as Nguoi dung
    participant FE as Frontend SPA
    participant BE as Backend API
    participant DB as PostgreSQL
    participant AI as Gemini API

    Note over U,AI: LUONG 1 - DANG NHAP
    U->>FE: Nhap email + password
    FE->>BE: POST /api/v1/auth/login
    BE->>DB: Truy van User + verify bcrypt
    DB-->>BE: User data
    BE-->>FE: JWT Access Token
    FE->>FE: Luu token, chuyen trang

    Note over U,AI: LUONG 2 - TAO KE HOACH (AI PLANNING)
    U->>FE: Nhap mo ta + dinh kem anh
    FE->>BE: POST /api/v1/plans (JWT + body)
    BE->>AI: Gui prompt + multimodal data
    AI-->>BE: Ke hoach + danh sach tasks
    BE->>DB: Luu Plan + Tasks
    DB-->>BE: Xac nhan
    BE-->>FE: Plan + Tasks response
    FE->>U: Hien thi ke hoach

    Note over U,AI: LUONG 3 - PHIEN TAP TRUNG (FOCUS SESSION)
    U->>FE: Chon task, bat dau Pomodoro
    FE->>BE: POST /api/v1/focus-sessions
    BE->>DB: Tao FocusSession
    FE->>FE: Chay timer Pomodoro
    U->>FE: Hoan thanh phien
    FE->>BE: PATCH /api/v1/focus-sessions/:id
    BE->>DB: Cap nhat trang thai

    Note over U,AI: LUONG 4 - XAC NHAN (AI VERIFY)
    U->>FE: Yeu cau xac nhan task
    FE->>BE: POST /api/v1/verifications
    BE->>AI: Gui context task de AI kiem tra
    AI-->>BE: Ket qua danh gia
    BE->>DB: Luu Verification result
    BE-->>FE: Ket qua xac nhan
    FE->>U: Hien thi ket qua
```

---

## 4. Mô tả Chi tiết Từng Thành Phần

### 4.1. Frontend - Browser SPA

| Thành phần   | Công nghệ                | Vai trò                                               |
| ------------ | ------------------------ | ----------------------------------------------------- |
| UI Framework | React 18+ (Vite)         | Render giao diện, quản lý state component             |
| Ngôn ngữ     | TypeScript               | Type-safe, giảm bug runtime, cải thiện DX             |
| Styling      | Tailwind CSS + shadcn/ui | Utility-first CSS, component library accessible + đẹp |
| Routing      | React Router v6+         | Điều hướng SPA, protected routes                      |
| HTTP Client  | Axios                    | Gọi REST API, interceptor JWT, xử lý lỗi tập trung    |

**Trách nhiệm chính:**

- Render 12 màn hình MVP
- Quản lý state phía client (auth token, form data, UI state)
- Gọi API backend qua Axios với JWT token đính kèm
- Xử lý timer Pomodoro phía client (không phụ thuộc server cho countdown)

### 4.2. Backend - API Server

| Thành phần      | Công nghệ    | Vai trò                                                   |
| --------------- | ------------ | --------------------------------------------------------- |
| Runtime         | Node.js      | Môi trường chạy JavaScript phía server                    |
| Framework       | Express.js   | Xử lý HTTP request, routing, middleware                   |
| Auth Middleware | JWT + bcrypt | Xác thực token, mã hóa mật khẩu                           |
| ORM             | Prisma       | Truy vấn database type-safe, migration, schema management |

**Trách nhiệm chính:**

- Cung cấp REST API endpoints (`/api/v1/*`)
- Xác thực và phân quyền (JWT middleware)
- Xử lý business logic (tạo kế hoạch, quản lý phiên, xác nhận)
- Gọi Gemini API và xử lý response AI
- Validate input, xử lý lỗi, trả response chuẩn hóa

### 4.3. Database - PostgreSQL

| Thành phần | Công nghệ  | Vai trò                                         |
| ---------- | ---------- | ----------------------------------------------- |
| RDBMS      | PostgreSQL | Lưu trữ dữ liệu quan hệ, ACID compliance        |
| ORM        | Prisma ORM | Schema-first, type-safe queries, auto migration |

**Các entity chính (sơ khởi):**

```mermaid
erDiagram
    USER ||--o{ PLAN : "tao"
    USER ||--o{ FOCUS_SESSION : "thuc hien"
    PLAN ||--o{ TASK : "bao gom"
    TASK ||--o{ FOCUS_SESSION : "gan voi"
    TASK ||--o{ VERIFICATION : "duoc xac nhan"

    USER {
        uuid id PK
        string email UK
        string password_hash
        string name
        timestamp created_at
        timestamp updated_at
    }

    PLAN {
        uuid id PK
        uuid user_id FK
        string title
        text description
        text ai_raw_response
        string status
        timestamp created_at
    }

    TASK {
        uuid id PK
        uuid plan_id FK
        string title
        text description
        string image_url
        string category
        string priority
        string status
        int estimated_minutes
        timestamp due_date
    }

    FOCUS_SESSION {
        uuid id PK
        uuid user_id FK
        uuid task_id FK
        int duration_minutes
        string status
        timestamp started_at
        timestamp ended_at
    }

    VERIFICATION {
        uuid id PK
        uuid task_id FK
        string type
        text ai_questions
        text user_answers
        text ai_evaluation
        int score
        timestamp created_at
    }
```

### 4.4. Dịch vụ Bên ngoài - Gemini API

| Thành phần | Công nghệ         | Vai trò                                     |
| ---------- | ----------------- | ------------------------------------------- |
| AI Service | Google Gemini API | Xử lý ngôn ngữ tự nhiên, phân tích hình ảnh |

**Các use case AI:**

| Use Case               | Input                       | Output                                  |
| ---------------------- | --------------------------- | --------------------------------------- |
| AI Planning            | Text mô tả + ảnh (tùy chọn) | Kế hoạch + danh sách tasks có phân loại + hình ảnh minh họa subtask |
| AI Task Classification | Context task                | Phân loại: học thuật / sinh hoạt        |
| AI Examiner            | Nội dung task học thuật     | Câu hỏi kiểm tra + đánh giá câu trả lời (text/voice) |

> **Ghi chú:** Tính năng AI Reflection (đối với task sinh hoạt) đã được loại bỏ theo kết quả phỏng vấn người dùng. Thay thế bằng **Màn hình Chúc mừng (Celebration Screen)** với tính năng chụp ảnh khoảnh khắc khi hoàn thành task (xử lý hoàn toàn ở Frontend, không cần AI).

### 4.5. Authentication - JWT Flow

```mermaid
graph LR
    A["Dang ky\nPOST /auth/register"] --> B["Hash password\nbcrypt"]
    B --> C["Luu User vao DB"]

    D["Dang nhap\nPOST /auth/login"] --> E["Verify password\nbcrypt.compare"]
    E --> F["Tao JWT Token"]
    F --> G["Tra ve token\ncho Frontend"]

    G --> H["Frontend gui request\nAuthorization: Bearer token"]
    H --> I["Auth Middleware\nVerify JWT"]
    I -->|Hop le| J["Cho phep truy cap\nAPI endpoint"]
    I -->|Khong hop le| K["401 Unauthorized"]

    style A fill:#e3f2fd,stroke:#1565C0
    style D fill:#e3f2fd,stroke:#1565C0
    style I fill:#fff9c4,stroke:#F9A825
    style J fill:#c8e6c9,stroke:#2E7D32
    style K fill:#ffcdd2,stroke:#C62828
```

---

## 5. Nguyên tắc Kiến trúc

| Nguyên tắc               | Mô tả                                                                |
| ------------------------ | -------------------------------------------------------------------- |
| YAGNI                    | Chỉ thiết kế cho MVP hiện tại, không dự đoán tương lai               |
| Separation of Concerns   | Frontend xử lý UI, Backend xử lý logic, Database lưu trữ             |
| Stateless Authentication | JWT cho phép scale horizontal nếu cần, không lưu session phía server |
| API-first                | Backend cung cấp REST API chuẩn, Frontend là consumer duy nhất       |
| Type Safety              | TypeScript (FE) + Prisma (BE) đảm bảo type-safe xuyên suốt           |

---

## 6. Quyết định Kiến trúc

| Quyết định                 | Lý do                                              | Phương án đã loại bỏ                            |
| -------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| Monolith (SPA + REST API)  | Team nhỏ, 10 tuần, đơn giản để phát triển + deploy | Microservices, Serverless                       |
| REST thay vì GraphQL       | Team quen thuộc, đủ cho MVP 12 màn hình            | GraphQL, gRPC                                   |
| PostgreSQL thay vì MongoDB | Dữ liệu quan hệ rõ ràng (User-Plan-Task)           | MongoDB, SQLite                                 |
| JWT thay vì Session-based  | Stateless, phù hợp SPA, dễ implement               | Session + Cookie, OAuth2 (quá phức tạp cho MVP) |
| Gemini API thay vì OpenAI  | Free tier, hỗ trợ multimodal sẵn                   | OpenAI GPT, Claude API                          |
| Bỏ AI Reflection, thay bằng Celebration Screen | Kết quả phỏng vấn: người dùng thấy phản tư phiền toái, ưu tiên gamification | Giữ AI Reflection như ban đầu |

---

## 7. Ghi chú Phát triển Tiếp theo

> **Lưu ý:** Đây là bản sơ đồ sơ khởi (v0.1). Các điểm sau sẽ được tinh chỉnh trong Sprint 2-3:

- **Sprint 2:** Thiết kế chi tiết Database Schema (Prisma schema), API Endpoints cụ thể, Error handling strategy
- **Sprint 3:** Thiết kế chi tiết AI Prompt Templates, Caching strategy (nếu cần), Security hardening
- **Sprint 4-5:** Bổ sung File Processing Layer (PDF/DOCX parser) cho AI Planning input, cho phép người dùng tải lên tài liệu PDF/DOCX để AI phân tích và tạo kế hoạch. Quyết định deployment infrastructure, CI/CD pipeline

---
