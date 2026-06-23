# Frontend Tech Stack — Phân tích & Định hướng

> **Người soạn:** Nguyễn Phương Gia Bảo (Frontend Leader)

> **Ngày:** 23/06/2026

> **Mục đích:** Đề xuất bổ sung, cập nhật tech task

---

## Tóm tắt đề xuất

Giữ nguyên định hướng ban đầu trong Proposal v1.3, bổ sung thêm **TypeScript** (thay JavaScript) và **shadcn/ui** (component library).

|                   | Proposal v1.3 | Đề xuất cập nhật          |
| ----------------- | ------------- | ------------------------- |
| Ngôn ngữ          | JavaScript    | **TypeScript**            |
| Build tool        | Vite          | Vite (giữ nguyên)         |
| UI Framework      | React         | React (giữ nguyên)        |
| Styling           | Tailwind CSS  | Tailwind CSS (giữ nguyên) |
| Component Library | _(không có)_  | **shadcn/ui**             |
| Routing           | React Router  | React Router (giữ nguyên) |
| HTTP Client       | Axios         | Axios (giữ nguyên)        |

---

## Phân tích chi tiết từng tech task

---

### 1. React

Thư viện JavaScript dùng để xây dựng giao diện người dùng (UI). Thay vì viết HTML tĩnh, React cho phép tạo ra các component tái sử dụng — mỗi component là một khối UI độc lập có thể nhận dữ liệu và tự cập nhật khi dữ liệu thay đổi. Planning AI có nhiều màn hình với trạng thái phức tạp — ví dụ: màn hình Focus Session cần đếm ngược thời gian, cập nhật trạng thái task realtime, hiển thị thông báo khi hết giờ. Làm điều này với HTML/JS thuần hơi khó quản lý. React giải quyết bài toán này gọn gàng thông qua cơ chế state và component.

**Ưu điểm mà nó mang lại**
- 12 màn hình được xây dựng từ các component nhỏ tái sử dụng — Button, Card, Modal viết một lần, dùng ở khắp nơi (điều này giúp tuân thủ OOP).
- Các component có thể được viết độc lập mà không ảnh hưởng gì đến nhay
- Khi BE trả về dữ liệu mới (ví dụ: danh sách task), giao diện tự cập nhật mà không cần reload trang.

---

### 2. Vite

Công cụ build và chạy project frontend. Thay thế cho Create React App (CRA) cũ — nhanh hơn, nhẹ hơn, cấu hình ít hơn.

**Lý do dùng Vite thay vì CRA**
CRA hiện đã ngừng bảo trì và rất chậm — mỗi lần lưu file phải chờ vài giây mới thấy thay đổi trên trình duyệt. Vite dùng native ES modules, thay đổi hiển thị gần như tức thì (dưới 100ms). Với project 12 màn hình, sự khác biệt này tích lũy thành hàng giờ tiết kiệm được.

**Ưu điểm mà nó mang lại**
- Khởi động dev server nhanh (dưới 1 giây so với 10-30 giây của CRA).
- Hot Module Replacement (HMR) — sửa code, trình duyệt cập nhật ngay, không mất trạng thái hiện tại.
- Tích hợp TypeScript sẵn, không cần cấu hình thêm.
- Build production nhanh và tối ưu hơn.

---

### 3. TypeScript _(bổ sung so với Proposal v1.3)_

**TypeScript là gì?**
TypeScript là JavaScript nhưng có thêm hệ thống kiểu dữ liệu (type system). Thay vì viết:
```javascript
function createTask(title, priority, deadline) { ... }
```
TypeScript yêu cầu khai báo rõ:
```typescript
function createTask(title: string, priority: "high" | "medium" | "low", deadline: Date): Task { ... }
```
Nếu ai đó gọi hàm sai kiểu, IDE báo lỗi ngay — không cần chạy mới biết.

**Lý do đề xuất TypeScript?**

_Lý do 1 — BE đã dùng TypeScript:_
Backend của nhóm chạy Node.js + Express với TypeScript. Khi FE dùng JS thuần và BE dùng TS, hai bên không thể chia sẻ định nghĩa kiểu dữ liệu. Ví dụ: BE định nghĩa `Task` có field `due_date` kiểu `Date`, nhưng FE không biết điều đó và xử lý nó như `string` — lỗi xảy ra lúc runtime, khó debug.

_Lý do 2 — Response từ Gemini API phức tạp:_
AI Planning trả về cấu trúc JSON từ Gemini có thể thay đổi. TypeScript giúp định nghĩa rõ schema mong đợi và phát hiện ngay khi response không khớp.

_Lý do 3 — shadcn/ui được thiết kế cho TypeScript:_
Dùng shadcn với JS thuần mất đi toàn bộ type hints và autocomplete — developer experience giảm đáng kể.

**Nó giúp nhóm điều gì?**
- Phát hiện lỗi lúc viết code, không phải lúc demo với thầy.
- Autocomplete chính xác hơn — gõ `task.` IDE gợi ý đúng các field có sẵn.
- Refactor an toàn hơn — đổi tên field, TypeScript báo ngay chỗ nào bị ảnh hưởng.
- Tích hợp API ít lỗi hơn — kiểu dữ liệu từ BE và FE khớp nhau.

**Rủi ro và cách xử lý:**

| Rủi ro                          | Cách xử lý                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Thành viên chưa quen TypeScript | Dành buổi đầu Sprint 2 để pair programming, học qua thực hành                                               |
| Tốc độ code ban đầu chậm hơn    | Chấp nhận ở Sprint 2, từ Sprint 3 sẽ nhanh hơn nhờ ít bug                                                   |
| Phải khai báo type cho mọi thứ  | Dùng `type inference` — TypeScript tự đoán type trong nhiều trường hợp, không phải khai báo thủ công tất cả |

---

### 4. Tailwind CSS

Utility-first CSS framework — thay vì viết file CSS riêng, bạn style trực tiếp trong JSX bằng class:
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
  Tạo kế hoạch
</button>
```

**Tại sao dùng Tailwind?**
Planning AI là web app với nhiều component nhỏ. Viết CSS riêng cho từng component dễ dẫn đến class name conflict, file CSS phình to, và khó maintain. Tailwind giải quyết hoàn toàn vấn đề này — không có file CSS riêng, không có class name conflict, mọi style nằm ngay tại component.

**Nó giúp nhóm điều gì?**
- Tốc độ build UI nhanh hơn đáng kể — không cần chuyển qua lại giữa file JSX và CSS.
- Responsive design dễ dàng với các prefix `sm:`, `md:`, `lg:`.
- Thay đổi style không ảnh hưởng component khác.
- Kết hợp hoàn hảo với shadcn/ui — shadcn cũng dùng Tailwind, không conflict.
- Design token nhất quán — màu sắc, spacing, border-radius được định nghĩa một lần, dùng xuyên suốt.

---

### 5. shadCN/ui _(bổ sung so với Proposal v1.3)_

**shadCN/ui là gì?**
Bộ component UI được xây dựng trên nền Radix UI (phần logic/behavior) và Tailwind CSS (phần styling). Điểm đặc biệt: thay vì cài như package thông thường (`npm install`), các component được **copy trực tiếp vào source code** của project. Nhóm sở hữu hoàn toàn code, thoải mái sửa theo ý muốn.

**Tại sao dùng shadcn/ui?**
Project có 12 màn hình với nhiều component lặp lại: Button, Input, Modal/Dialog, Dropdown, Card, Toast notification, Tabs, Progress bar... Việc ta tự build hoặc build bằng AI đôi khi mang đến cảm giác khó chịu đốt token hoang phí, thay vào đó ta chỉ cần gọi lại chúng mà thực hiện, chưa kể accessibility (keyboard navigation, screen reader) thứ rất khó làm đúng nếu tự build.

shadcn cung cấp tất cả những component đó, đã xử lý sẵn accessibility, animation, và dark mode. Nhóm tập trung vào logic business thay vì build UI primitives.

**Radix UI - mối quan hệ giữa Radix và shadCN**
Radix UI là tầng nền bên dưới shadcn, nó cung cấp behavior của component (Dialog biết cách đóng khi bấm Escape, Dropdown tự quản lý focus, Tooltip xuất hiện đúng vị trí). shadcn lấy Radix làm nền và khoác Tailwind lên để có giao diện. Người dùng không cần tương tác trực tiếp với Radix, dùng shadcn là đủ.

**Nó giúp nhóm điều gì?**
- Đây là công cụ được dùng phổ biến trong các web application trên thế giới, giúp chúng ta theo chuẩn toàn cầu.
- Tiết kiệm thời gian build component từ đầu tập trung vào tính năng.
- UI nhất quán xuyên suốt 12 màn hình tất cả cùng dùng một component system.
- Accessibility sẵn có, không cần lo keyboard navigation, ARIA attributes.
- Dễ customize, vì code nằm trong project, sửa trực tiếp theo design.
- Có Figma kit chính thức —  dùng kit này để design, đảm bảo 1-1 với code.

**Lưu ý quan trọng và cũng là rủi ro lớn đối với shadCN:**
Giữa dev và UX/UI designer chưa có sự thống nhất, cần phải thống nhất với nhau. UI/UX Designer thiết kế theo template sẵn có tương ứng với shadCN sẽ hợp lý và phù hợp hơn (kit đã có sẵn không phải quá lo)

### 6. React Router

**React Router là gì?**
Thư viện quản lý điều hướng (routing) trong React app. Cho phép chuyển trang mà không reload trình duyệt — URL thay đổi (`/dashboard` → `/focus-session`) nhưng app vẫn chạy liền mạch.

**Tại sao cần React Router?**
Không có React Router, Planning AI chỉ có thể hiển thị một màn hình duy nhất. 12 màn hình trong project đều cần URL riêng để người dùng có thể bookmark, share link, hoặc dùng nút Back/Forward của trình duyệt.

**Nó giúp nhóm điều gì?**
- Định nghĩa rõ ràng 12 route tương ứng với 12 màn hình.
- Bảo vệ route cần đăng nhập — tự động redirect về Login nếu chưa auth.
- Truyền dữ liệu giữa các trang qua URL params (ví dụ: `/plan/:planId`).
- Lazy loading — chỉ load code của màn hình khi người dùng truy cập, app khởi động nhanh hơn.

---

### 7. Axios

**Axios là gì?**
Thư viện dùng để gọi HTTP request từ FE lên BE (REST API). Thay thế cho `fetch()` có sẵn trong trình duyệt nhưng tiện hơn nhiều.

**Tại sao dùng Axios thay fetch?**
`fetch()` thuần cần xử lý thủ công nhiều thứ: convert JSON, xử lý lỗi HTTP (404, 500), thêm header Authorization cho mọi request. Axios làm tất cả điều đó tự động và có thêm nhiều tính năng hữu ích.

**Nó giúp nhóm điều gì?**
- Tự động convert JSON — không cần gọi `.json()` thủ công.
- Interceptor — thêm JWT token vào header của mọi request một lần duy nhất, không phải viết lại ở từng chỗ gọi API.
- Xử lý lỗi tập trung — bắt lỗi 401 (hết token) ở một chỗ, tự động redirect về Login.
- Timeout config — tránh app bị treo khi BE không phản hồi.
- Kết hợp tốt với TypeScript — có thể type response từ API.

---

## Tổng kết

```
React          →  xây dựng UI theo component
Vite           →  build tool, dev server cực nhanh
TypeScript     →  an toàn kiểu dữ liệu, ít bug hơn
Tailwind CSS   →  styling nhanh, nhất quán, không conflict
shadcn/ui      →  component có sẵn, không tự build lại từ đầu
React Router   →  điều hướng 12 màn hình
Axios          →  giao tiếp với BE API
```

Stack này được thiết kế để:
- **Tốc độ:** Vite + shadcn giảm thời gian setup và build UI.
- **Chất lượng:** TypeScript giảm bug, đặc biệt khi tích hợp AI API phức tạp.
- **Nhất quán:** Tailwind + shadcn đảm bảo UI đồng nhất xuyên suốt 12 màn hình.
- **Scalable:** Từng công nghệ phục vụ một mục đích rõ ràng, không overlap.
