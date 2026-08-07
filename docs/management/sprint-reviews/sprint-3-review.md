# Sprint 3 Review

> **Tài liệu:** Sprint Review chính thức · 

> **Liên quan:** Issue #129 (I9.3)

> **Sprint 3:** 13/07/2026 – 26/07/2026 · 

> **Viết lại:** 06/08/2026

> **Người viết:** @tkiet24

---

## Phần 1 — Tổng quan Sprint 3

### Thông tin Sprint

| Mục | Chi tiết |
|---|---|
| **Thời gian** | 13/07/2026 – 26/07/2026 |
| **Team size** | 5 người |
| **Sprint Goal** | Hoàn thiện hạ tầng (EPIC #1), Auth Module (EPIC #2), AI Study Planner MVP (EPIC #3), Figma Redesign (EPIC #4), và toàn bộ tài liệu PA3 (EPIC #5) |
| **Tổng số issue Sprint 3** | 30 issues (EPIC + sub-issues) |
| **Nguồn dữ liệu** | `gh issue list --milestone "Sprint 3" --state all` |

### Thành viên & Phân công theo domain

| Thành viên | GitHub | Phụ trách chính |
|---|---|---|
| Nguyễn Thế Quân | @Lade1q | Backend (EPIC #3 — AI/Graph), Architecture, Docs |
| Nguyễn Phương Gia Bảo | @baonguyen1776 | Frontend (Auth, Study Planner UI) |
| Nguyễn Minh Phát | @NMP039 | Full-stack infra, QA, Docs |
| Ngô Văn Phong | @phong0801 | Backend (Auth BE, EPIC #1 infra), Bug fix |
| Thái Nguyễn Tuấn Kiệt | @tkiet24 | UI Design (Figma), Docs, Quản lý |

---

## Phần 2 — Bảng kết quả

### Thống kê tổng hợp

| Chỉ số | Giá trị |
|---|---|
| Tổng issue Sprint 3 | 31 (30 có milestone + #85 thiếu milestone) |
| Hoàn thành đúng hạn (≤ 26/07) | 20 |
| Hoàn thành trễ (27/07 – 09/08, trong Sprint 4) | 11 |
| Hoàn thành tất cả (hiện tại 06/08) | 31 / 31 ✅ |
| Velocity thực tế trong Sprint 3 | ~65% (20/31 issues đúng hạn) |

---

### 2A. Issues hoàn thành đúng hạn trong Sprint 3 (≤ 26/07/2026)

| # | Issue | Tiêu đề | Assignee | Đóng lúc | Domain |
|---|---|---|---|---|---|
| 1 | #62 | I1.1 - [BE] Init project Node.js + Express + TypeScript | @phong0801 | 16/07 | BE / Infra |
| 2 | #63 | I1.2 - [BE] Setup Prisma + PostgreSQL Schema | @Lade1q | 18/07 | BE / Infra |
| 3 | #64 | I1.3 - [FE] Init project React + Vite + shadcn/ui | @baonguyen1776 | 18/07 | FE / Infra |
| 4 | #65 | I1.4 - [FE] Setup React Router + Layout System | @Lade1q | 20/07 | FE / Infra |
| 5 | #66 | I1.5 - [INFRA] Setup ESLint, Prettier, Husky, CI | @NMP039 | 19/07 | Infra |
| 6 | #61 | [EPIC #1] Architecture Setup - Thiết lập kiến trúc dự án | All | 20/07 | EPIC |
| 7 | #71 | I2.1 - [BE] API Register + Login + JWT | @phong0801 | 19/07 | BE / Auth |
| 8 | #72 | I2.2 - [FE] UI Login / Register Pages | @baonguyen1776 | 22/07 | FE / Auth |
| 9 | #73 | I2.3 - [FE] Auth Context + Protected Routes | @baonguyen1776 | 22/07 | FE / Auth |
| 10 | #74 | I2.4 - [QA] Test Cases cho Auth Module | @NMP039 | 26/07 | QA |
| 11 | #67 | [EPIC #2] Auth Module - Account Management | Multi | 26/07 | EPIC |
| 12 | #75 | I3.1 - [BE] API Create Study Plan + File Upload | @phong0801 | 22/07 | BE |
| 13 | #76 | I3.2 - [BE] Gemini API Integration (extract_concepts) | @Lade1q | 25/07 | BE / AI |
| 14 | #77 | I3.3 - [BE] Concept Graph Engine - DAG Validation | @Lade1q | 25/07 | BE |
| 15 | #81 | I4.1 - [UI] Redesign toàn bộ UI trên Figma | @tkiet24 | 24/07 | UI Design |
| 16 | #84 | I5.1 - [DOC] Software Architecture Document (SAD) | @Lade1q, @phong0801 | 26/07 | Docs |
| 17 | #86 | I5.3 - [DOC] DB Design / ER Model (in SAD) | @Lade1q, @NMP039 | 26/07 | Docs |
| 18 | #87 | I5.4 - [DOC] Use-case Specification v2.0 (Revised) | @Lade1q, @NMP039 | 26/07 | Docs |
| 19 | #91 | I5.5 [DOC] Weekly Reports (Sprint 3) | @tkiet24 | 26/07 | Docs |
| 20 | #85 | I5.2 - [DOC] Class Diagrams (Section 4.x of SAD) ⭐ | @Lade1q, @NMP039 | 26/07 | Docs |

> [!NOTE]
> **Issue #85 — Vì sao không có trong `gh issue list --milestone`:** Issue này có label `sprint-3` nhưng trường `milestone` là `null` — tức là bị bỏ quên không gán milestone. Đây là lỗi cấu hình GitHub, không phải issue bị bỏ sót thực sự. **Hành động cần làm:** Gán milestone "Sprint 3" cho #85 bằng lệnh `gh issue edit 85 --milestone "Sprint 3" --repo Lade1q/planning-ai` để dọn dẹp metadata. Ngoài ra, trong nội dung issue, checkbox cuối (`[ ] Chèn sơ đồ và mô tả vào Section 4.x của tài liệu SAD`) chưa được tick — cần xác nhận xem phần này đã được thực hiện thực tế chưa hay chỉ là quên tick.

---

### 2B. Issues hoàn thành trễ - Carry-over sang Sprint 4

Các issue dưới đây có `closedAt` **sau ngày 26/07/2026**, hoàn thành trong Sprint 4.

| # | Issue | Tiêu đề | Assignee | Đóng lúc | Trễ | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | #78 | I3.4 - [FE] UI Create Study Plan Page | @baonguyen1776 | 30/07 | 4 ngày | Priority-high |
| 2 | #79 | I3.5 - [FE] Concept Graph Viewer (react-flow, mock data) | @baonguyen1776 | 31/07 | 5 ngày | Priority-high |
| 3 | #80 | I3.6 - [QA] Test Cases cho Study Planner Module | @NMP039 | 02/08 | 7 ngày | Phụ thuộc #78, #79 |
| 4 | #68 | [EPIC #3] AI Study Planner - Ingest & Map | Multi | 02/08 | 7 ngày | EPIC — đợi sub-issues |
| 5 | #82 | I4.2 - [UI] Design System & Component Library (Figma) | @tkiet24 | 29/07 | 3 ngày | Priority-medium |
| 6 | #83 | I4.3 - [UI] Handoff tài liệu cho Frontend | @baonguyen1776, @tkiet24 | 29/07 | 3 ngày | Priority-medium |
| 7 | #69 | [EPIC #4] UI Prototyping - Thiết kế lại giao diện | @tkiet24 | 29/07 | 3 ngày | EPIC — đợi #82, #83 |
| 8 | #90 | I4.4 - [DOC] Tài liệu "UI Design" cho PA3 ⭐ GRADE | @baonguyen1776, @tkiet24 | 29/07 | 3 ngày | Tài liệu PA3 |
| 9 | #70 | [EPIC #5] Documentation PA3 - Tài liệu nộp bài | Multi | 29/07 | 3 ngày | EPIC |
| 11 | #101 | [Bug] Auth: API Register cho phép mật khẩu toàn khoảng trắng | @Lade1q, @phong0801 | 29/07 | 3 ngày | Bug phát sinh ngoài kế hoạch |

---

### 2C. Issues bị bỏ sót hoàn toàn — Không có trong Sprint 3

| Tính năng/Task | Lý do bỏ sót |
|---|---|
| **Focus Session Module** | Không ai tạo issue. Đây là deliverable PA3 nhưng bị bỏ qua hoàn toàn trong quá trình lập kế hoạch Sprint 3. Hiện thuộc EPIC #110, sẽ xử lý trong Sprint 4. |

---

## Phần 3 — Root Cause Analysis

> **Phương pháp:** Mỗi task carry-over được phân tích theo chuỗi **Hiện tượng → Nguyên nhân bề mặt → Nguyên nhân gốc → Loại lỗi**.

---

### 3.1. Nhóm FE Study Planner: #78 và #79

**Issues:** `I3.4 - [FE] UI Create Study Plan Page` và `I3.5 - [FE] Concept Graph Viewer`
**Assignee:** @baonguyen1776 (cả hai)

| | #78 | #79 |
|---|---|---|
| Tạo lúc | 16/07 | 16/07 |
| Đóng lúc | 30/07 | 31/07 |
| Trễ | 4 ngày | 5 ngày |

**Bằng chứng thực tế:**
- Body issue #78, cập nhật ngày 29/07 (3 ngày sau khi sprint kết thúc): *"code `src/client/src/pages/planning/CreatePlanPage.tsx` hiện vẫn là **placeholder** → phần FE build còn lại"*
- Body issue #79, cập nhật ngày 29/07: *"Route `/plan/:id` **chưa khai báo** trong `App.tsx` → FE build còn nguyên"*
- Cả hai issue đều được tạo từ ngày 16/07 nhưng đến 29/07 code vẫn là placeholder — tức là **không có tiến độ thực chất trong suốt 13 ngày đầu sprint**.

**Timeline thực tế của @baonguyen1776 trong Sprint 3:**
```
16/07 → Được assign #64 (FE Init React+Vite), #78 (Create Plan UI), #79 (Graph Viewer)
18/07 → Xong #64 (Init)
22/07 → Xong #72 (Auth UI), #73 (Auth Context)
      ← hết việc Auth, chuyển sang #78, #79
29/07 → Code #78 và #79 vẫn là placeholder (ghi nhận trong body issue)
30/07 → Đóng #78
31/07 → Đóng #79
```

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Cả hai issue FE Study Planner chưa có code thực sự đến ngày 29/07 |
| **Nguyên nhân bề mặt** | @baonguyen1776 bận làm Auth FE (#72, #73) trong phần lớn Sprint 3 |
| **Nguyên nhân gốc** | Khi lập kế hoạch, Auth và Study Planner FE được assign cho cùng 1 người, nhưng Auth là blocking dependency - #72 chỉ xong 22/07 mới giải phóng được thời gian cho #78, #79. Chỉ còn 4 ngày (22-26/07) - không đủ cho 2 task FE phức tạp (mỗi task có 7-9 checklist). Không có buffer, không có người backup. |
| **Loại lỗi** | **Ước lượng sai + Thiếu người** |

---

### 3.2. #80 — QA Test Cases Study Planner

**Issue:** `I3.6 - [QA] Test Cases cho Study Planner Module`
**Assignee:** @NMP039

| | Giá trị |
|---|---|
| Tạo lúc | (trong sprint) |
| Đóng lúc | 02/08 |
| Trễ | 7 ngày |

**Bằng chứng thực tế:**
- Trong body issue #79 ghi rõ: *"#80 [QA] Test Cases phụ thuộc #78 và #79"* — nghĩa là QA không thể viết test cases cho UI chưa tồn tại.
- #78 đóng 30/07, #79 đóng 31/07 → #80 chỉ có thể bắt đầu sớm nhất 31/07 → đóng 02/08 là hệ quả tất yếu.

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Test Cases chưa viết được đến hết sprint |
| **Nguyên nhân bề mặt** | #80 phụ thuộc #78 và #79 chưa xong |
| **Nguyên nhân gốc** | Xem mục 3.1 — đây là **hệ quả dây chuyền** của việc #78 và #79 trễ. Bản thân #80 không có lỗi lập kế hoạch riêng. |
| **Loại lỗi** | **Bị chặn bởi task khác** |

---

### 3.3. #82 và #83 — Design System & Handoff

**Issues:** `I4.2 - Design System & Component Library` và `I4.3 - Handoff tài liệu cho Frontend`
**Assignees:** @tkiet24 (#82), @baonguyen1776 + @tkiet24 (#83)

| | #81 (Dependency) | #82 | #83 |
|---|---|---|---|
| Đóng lúc | 24/07 | 29/07 | 29/07 |
| Trễ | Đúng hạn | 3 ngày | 3 ngày |

**Bằng chứng thực tế:**
- Body issue #82 cập nhật 29/07 ghi: *"Design System được giao bằng **Claude Design** (không phải Figma)"* — deliverable đã thay đổi giữa sprint so với mô tả ban đầu ("Tạo trang Design System trong Figma").
- #81 (Figma Redesign) đóng 24/07 → #82 phụ thuộc #81 → chỉ còn **2 ngày làm việc** (24-26/07) để hoàn thành #82 lẫn #83.
- Cả #82 và #83 đều do @tkiet24 phụ trách chính, trong khi @tkiet24 cũng đang phụ trách quản lý và tài liệu.

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Design System và Handoff xong sau deadline 3 ngày |
| **Nguyên nhân bề mặt** | Figma Redesign (#81) xong muộn (24/07), chỉ còn 2 ngày cho 2 task tiếp theo |
| **Nguyên nhân gốc** | Chuỗi phụ thuộc tuyến tính **#81 → #82 → #83** không có buffer time. Khi #81 trễ (dù chỉ 2 ngày), toàn bộ chuỗi sau đó bị đẩy trễ theo. Ngoài ra, nguyên nhân chủ quan: @tkiet24 chưa thực hiện đúng theo timeline đã đề ra|
| **Loại lỗi** | **Ước lượng sai + Bị chặn bởi task khác** |

> [!NOTE]
> **Thay đổi deliverable #82 giữa sprint:** Ban đầu yêu cầu làm trong Figma, thực tế được thực hiện bằng Claude Design (HTML). Đây có thể là quyết định hợp lý về mặt kỹ thuật, nhưng cần ghi lại chính thức trong quy trình để tránh sự không nhất quán với acceptance criteria ban đầu.

---

### 3.4. #90 — Tài liệu UI Design cho PA3

**Issue:** `I4.4 - [DOC] Tài liệu "UI Design" cho PA3 ⭐ GRADE`
**Assignees:** @baonguyen1776, @tkiet24

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Tài liệu PA3 UI Design nộp trễ 3 ngày |
| **Nguyên nhân bề mặt** | Phụ thuộc #82 và #83 xong trước |
| **Nguyên nhân gốc** | **Hệ quả dây chuyền** từ #81 → #82 → #83 → #90. Bản thân #90 không có lỗi lập kế hoạch độc lập. |
| **Loại lỗi** | **Bị chặn bởi task khác** |

---

### 3.5. #101 — Bug mật khẩu toàn khoảng trắng

**Issue:** `[Bug] Auth: API Register cho phép mật khẩu toàn dấu khoảng trắng`
**Assignees:** @Lade1q, @phong0801

| | Giá trị |
|---|---|
| Tạo lúc | 24/07 |
| Đóng lúc | 29/07 |

**Bằng chứng thực tế:**
- `createdAt: 24/07` — được phát hiện sau khi QA Auth (#74) thực thi test case `TC-AM-01-08`.
- Body issue ghi rõ nguyên nhân kỹ thuật: *"Validation Zod chỉ kiểm tra `min(8)` nhưng thiếu `.trim()` hoặc regex chặn chuỗi toàn khoảng trắng"*.
- Issue không nằm trong kế hoạch ban đầu của Sprint 3, phát sinh từ quá trình QA Testing.

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Bug bảo mật tồn tại trong module Auth sau khi merge |
| **Nguyên nhân bề mặt** | Validation schema Zod thiếu rule `.trim()` |
| **Nguyên nhân gốc** | Không phải lỗi lập kế hoạch. Đây là bug chỉ được phát hiện qua QA testing (#74) — không thể dự đoán trước khi viết code. |
| **Loại lỗi** | **Ngoài kế hoạch** |

---

### 3.6. Focus Session Module — Không tồn tại trong Sprint 3

**Phân tích nguyên nhân:**

| Cấp độ | Giải thích |
|---|---|
| **Hiện tượng** | Không có code, không có issue, không có ai làm |
| **Nguyên nhân bề mặt** | Không ai được assign làm Focus Session |
| **Nguyên nhân gốc** | Trong quá trình lập kế hoạch Sprint 3, **không đối chiếu danh sách deliverable PA3 với danh sách issue**. Focus Session là deliverable bắt buộc trong PA3 nhưng bị bỏ qua hoàn toàn khi tạo issue. Không phải lỗi của cá nhân nào — là lỗi quy trình planning. |
| **Loại lỗi** | **Quên tạo issue** |

---

### 3.7. Tóm tắt phân loại nguyên nhân

| Loại lỗi | Issues bị ảnh hưởng | Số lượng |
|---|---|---|
| 🔴 **Ước lượng sai** | #78, #79 (FE cần 2+ tuần, chỉ được plan 4 ngày) | 2 |
| 🟠 **Bị chặn bởi task khác** | #80 (chờ #78+#79), #82+#83 (chờ #81), #90 (chờ #82+#83) | 5 |
| 🔵 **Quên tạo issue** | Focus Session Module | 1 |
| 🟣 **Ngoài kế hoạch** | #101 (bug phát sinh từ QA) | 1 |
| ⚪ **Thiếu người** | #78, #79 (FE chỉ 1 người cho Study Planner) | (kết hợp với ước lượng sai) |

> **Nhận xét tổng:** Phần lớn các task trễ (5/9) là **hệ quả dây chuyền** từ 2 nguyên nhân gốc chính: (1) FE Study Planner bị dồn cho 1 người sau khi xong Auth quá muộn, và (2) chuỗi phụ thuộc UI Design không có buffer time. Sửa 2 nguyên nhân gốc này sẽ giải quyết được phần lớn carry-over.

---


---

## Phần 4 — Điều chỉnh cho Sprint 4

> **Nguyên tắc:** Mỗi điều chỉnh phải gắn trực tiếp với 1 root cause đã xác định trong Phần 3. Không đưa ra lời khuyên chung chung ("cần cố gắng hơn", "giao tiếp tốt hơn").

---

### 4.1. Điều chỉnh quy trình lập kế hoạch sprint

**Gắn với root cause:** Mục 3.6 — Quên tạo issue cho Focus Session

**Vấn đề thực tế:** Khi lập kế hoạch Sprint 3, không có bước đối chiếu danh sách deliverable trong SDP/PA với danh sách issue được tạo. Focus Session là deliverable bắt buộc PA3 nhưng không ai phát hiện ra cho đến khi sprint kết thúc.

**Điều chỉnh cụ thể cho Sprint 4:**
> Trước khi chốt danh sách issue cho sprint, PM phải chạy checklist: mở tài liệu SDP (mục Deliverables) và PA spec, đối chiếu từng mục với danh sách issue đã tạo. Bất kỳ deliverable nào chưa có issue → tạo issue ngay, không để sang tuần.

**Bằng chứng Sprint 4 đã áp dụng:** Focus Session được đưa vào EPIC #110 (`[EPIC #8] Focus Session - Phiên học Pomodoro (nợ từ PA3)`) và issue #126 (BE API Focus Session, CLOSED 05/08). Hành động này được thực hiện ngay từ đầu Sprint 4.

---

### 4.2. Không giao toàn bộ FE một domain cho 1 người nếu domain đó có phụ thuộc tuần tự

**Gắn với root cause:** Mục 3.1 — FE Study Planner bị dồn cho 1 người sau khi xong Auth

**Vấn đề thực tế:** Sprint 3 giao @baonguyen1776 làm Auth FE (#72, #73) trước, sau đó mới đến Study Planner FE (#78, #79). Auth FE xong 22/07 → chỉ còn 4 ngày cho 2 task Study Planner FE phức tạp. Kết quả: cả hai trễ 4-5 ngày.

**Điều chỉnh cụ thể cho Sprint 4:**
> Khi một người phụ trách cả chuỗi task tuần tự (A → B → C), phải ước lượng thời gian thực của từng task và cộng lại. Nếu tổng thời gian > (ngày còn lại trong sprint - buffer 2 ngày) → phải tách sang sprint sau HOẶC assign người thứ hai song song.

**Bằng chứng Sprint 4 đã áp dụng:** Sprint 4 có nhiều issue FE phân chia cho nhiều người hơn — ví dụ #167, #168, #173, #174, #202, #204 đều là các issue FE riêng lẻ được đóng trong tuần đầu Sprint 4. Tuy nhiên, cần lưu ý: các issue FE core Sprint 4 (#118 — UI Interview, #119 — UI Kết quả phiên, #127 — UI Focus Session) vẫn đang OPEN tính đến 06/08, cho thấy pattern tương tự có thể đang lặp lại.

> [!NOTE]
> **Cần theo dõi:** Tính đến 06/08 (còn 3 ngày đến hết Sprint 4), các issue FE lớn #118, #119, #127, #169, #225 vẫn OPEN. Nếu không kịp, cần phân tích root cause tương tự cho Sprint 4 retrospective.

---

### 4.3. Chuỗi phụ thuộc UI Design phải có buffer time

**Gắn với root cause:** Mục 3.3 — Chuỗi #81 → #82 → #83 không có buffer

**Vấn đề thực tế:** #81 (Figma Redesign) xong 24/07 → chỉ còn 2 ngày cho #82 và #83. Hơi khó để hoàn thành 2 task design phức tạp trong 2 ngày kể cả nếu không có issue gì khác.

**Điều chỉnh cụ thể cho Sprint 4:**
> Với chuỗi phụ thuộc tuyến tính (task A → task B → task C), task đầu tiên phải xong **ít nhất 3 ngày làm việc** trước deadline sprint để task tiếp theo có thời gian thực hiện. Nếu không đảm bảo được điều này khi lập kế hoạch → cắt bớt task, đừng giữ nguyên kế hoạch rồi trễ.

**Bằng chứng Sprint 4 đã áp dụng:** Sprint 4 đã bắt đầu làm UI Design sớm hơn — #112 (Figma Interview/Focus Session) CLOSED 04/08, trước hạn 5 ngày. Cấu trúc issue cũng tách rõ hơn (Design → BE → FE thay vì gộp chung).

---

### 4.4. Sử dụng phần Relationships trong GitHub Issues để khai báo dependency

**Gắn với root cause:** Mục 3.2 và 3.4 — nhiều task bị chặn mà không được khai báo trước

**Vấn đề thực tế:** Dependency giữa #78/#79 và #80, giữa #81 và #82/#83 không được khai báo chính thức trong issue khi tạo. Chỉ đến khi trễ mới ghi vào body issue dưới dạng cập nhật trạng thái thủ công.

**Điều chỉnh cụ thể cho Sprint 4:**
> Mỗi issue trên GitHub đã có sẵn phần **Relationships** gồm 3 loại: *parent issue*, *blocked by*, *is blocking*. Khi tạo issue, phải điền phần này ngay — không để trống. Ví dụ: #80 phải được mark *blocked by* #78 và #79 ngay từ đầu sprint, không phải đợi đến khi trễ mới ghi chú trong body.

**Bằng chứng Sprint 4 đã áp dụng:** Quan sát thấy nhiều issue Sprint 4 có parent issue được khai báo (gắn với EPIC tương ứng). Tuy nhiên, việc dùng *blocked by* / *is blocking* vẫn chưa đồng đều — nhiều issue vẫn chỉ ghi dependency trong body thay vì dùng Relationships.

---

### 4.5. [Ghi nhận] PR không được treo quá 48 giờ

**Gắn với root cause:** Sprint 3 có PR #103 và PR #104 treo mở khi sprint kết thúc (ghi nhận trong issue #129)

**Điều chỉnh cụ thể cho Sprint 4:**
> PR phải được review trong vòng 48 giờ kể từ khi mở. Nếu sau 48 giờ chưa có reviewer → người tạo PR chủ động ping team trong channel trao đổi. PR treo > 3 ngày phải báo cáo trong daily/weekly report như một blocker.

---

## Phần 5 — Quyết định carry-over

> **Nguồn dữ liệu:** `gh issue list --milestone "Sprint 4" --state all` chạy ngày 06/08/2026. Tất cả issue Sprint 3 carry-over đã được chuyển milestone sang Sprint 4 — không có issue nào còn treo ở milestone Sprint 3.

### Trạng thái xử lý các issue carry-over từ Sprint 3

| Issue Sprint 3 | Tiêu đề | Quyết định | Trạng thái trong Sprint 4 | Đóng lúc |
|---|---|---|---|---|
| #78 | I3.4 - [FE] UI Create Study Plan Page | ✅ Chuyển Sprint 4 | CLOSED | 30/07 |
| #79 | I3.5 - [FE] Concept Graph Viewer | ✅ Chuyển Sprint 4 | CLOSED | 31/07 |
| #80 | I3.6 - [QA] Test Cases Study Planner | ✅ Chuyển Sprint 4 | CLOSED | 02/08 |
| #68 | [EPIC #3] AI Study Planner | ✅ Chuyển Sprint 4 | CLOSED | 02/08 |
| #82 | I4.2 - Design System & Component Library | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| #83 | I4.3 - Handoff tài liệu cho Frontend | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| #69 | [EPIC #4] UI Prototyping | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| #90 | I4.4 - Tài liệu UI Design PA3 ⭐ | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| #70 | [EPIC #5] Documentation PA3 | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| #101 | Bug: mật khẩu toàn khoảng trắng | ✅ Chuyển Sprint 4 | CLOSED | 29/07 |
| Focus Session | (không có issue) | ✅ Tạo mới EPIC #110 | OPEN (đang làm) | — |

> **Kết quả:** Tất cả 10 issue carry-over đã được xử lý trong Sprint 4. **Không còn issue nào treo ở milestone Sprint 3.**

---

### Focus Session — trạng thái hiện tại (06/08)

Issue được tạo mới trong Sprint 4 thay vì chuyển milestone (vì không tồn tại trong Sprint 3).

| Issue | Tiêu đề | Trạng thái |
|---|---|---|
| #110 | [EPIC #8] Focus Session - Phiên học Pomodoro | OPEN |
| #126 | I8.1 - [BE] API Focus Session + Pomodoro Config | CLOSED (05/08) |
| #127 | I8.2 - [FE] UI Focus Session | OPEN |

> [!NOTE]
> **#127 vẫn OPEN tính đến 06/08** — còn 3 ngày đến deadline Sprint 4 (09/08). Cần theo dõi sát.

---
