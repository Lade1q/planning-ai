# Recall AI — Design System v2

> Dựa trên shadcn preset `bPJV3d2hv`, adapted cho Tailwind CSS v4 (oklch color space)

---

## 1. Tokens

Toàn bộ design tokens được định nghĩa trong [`src/global.css`](../src/frontend/src/global.css).

**Color format:** oklch (Tailwind v4 native) — không dùng HSL.

---

## 2. Typography

**Font:** Geist Variable (via `@fontsource-variable/geist`)

> *Lưu ý: Design system v2 proposal khuyến nghị Inter cho Vietnamese support tốt hơn. Có thể đổi sau nếu cần.*

| Role            | Class Tailwind            | Size | Weight  |
| --------------- | ------------------------- | ---- | ------- |
| Landing hero    | `text-4xl font-extrabold` | 36px | 800     |
| Focus timer     | `text-3xl font-bold`      | 30px | 700     |
| Page title      | `text-2xl font-bold`      | 24px | 700     |
| Section heading | `text-xl font-semibold`   | 20px | 600     |
| Card title      | `text-lg font-medium`     | 18px | 500     |
| Body / Chat     | `text-base`               | 16px | 400     |
| Metadata        | `text-sm font-medium`     | 14px | 400/500 |
| Node label      | `text-xs`                 | 12px | 400     |

---

## 3. Color System

### 3.1 Base Palette (shadcn)

| Token           | Light (oklch)                    | Vai trò                  |
| --------------- | -------------------------------- | ------------------------ |
| `--primary`     | `oklch(0.457 0.24 277.1)` Indigo | Buttons chính, AI, Trust |
| `--accent`      | `oklch(0.541 0.242 293)` Violet  | AI Examiner, Quiz mode   |
| `--secondary`   | `oklch(0.968 0.003 264.5)` Slate | Inactive states, tags    |
| `--muted`       | `oklch(0.965 0.003 264.5)`       | Neutral backgrounds      |
| `--destructive` | `oklch(0.577 0.245 27.3)` Red    | Errors, API failures     |

### 3.2 Recall AI Custom Tokens

| Token                | Light (oklch)                      | Màu | Khi nào dùng                              |
| -------------------- | ---------------------------------- | --- | ----------------------------------------- |
| `--mastery-strong`   | `oklch(0.596 0.145 163.2)` Emerald | 🟢   | Concept đã vững (score ≥ 0.8), graph node |
| `--mastery-learning` | `oklch(0.769 0.171 70.1)` Amber    | 🟡   | Đang học (0.6 ≤ score < 0.8)              |
| `--mastery-weak`     | `oklch(0.547 0.245 16.4)` Rose     | 🔴   | Yếu/Sai (score < 0.6), cần ôn             |
| `--mastery-untested` | `oklch(0.852 0.009 264)` Cool Gray | ⚪   | Chưa kiểm tra                             |
| `--remediate`        | `oklch(0.702 0.183 52.5)` Orange   | 🟠   | Hệ thống tự chèn prerequisite vào lịch    |
| `--focus-session`    | `oklch(0.769 0.171 70.1)` Amber    | 🟡   | Pomodoro countdown, session active        |

### 3.3 Semantic Color Mapping — Workflow

| Bước Workflow           | Token             | Khi nào dùng                                      |
| ----------------------- | ----------------- | ------------------------------------------------- |
| **Ingest / AI Planner** | `--primary`       | Upload button, AI phân tích, "Tạo kế hoạch" CTA   |
| **Focus Session**       | `--focus-session` | Timer ring, session active badge                  |
| **AI Examiner**         | `--accent`        | Examiner bubble, "Đang vấn đáp" badge, câu hỏi AI |
| **Remediate (agentic)** | `--remediate`     | Banner "Hệ thống đã thêm ôn lại [X]"              |
| **Dashboard Graph**     | `--mastery-*`     | Concept nodes tô màu theo score                   |
| **Error / API fail**    | `--destructive`   | Gemini API lỗi, validation errors                 |

### 3.4 Chart Tokens

| Token       | Light                    | Dùng cho         |
| ----------- | ------------------------ | ---------------- |
| `--chart-1` | Indigo (primary)         | Primary data     |
| `--chart-2` | Emerald (mastery-strong) | Positive metrics |
| `--chart-3` | Rose (mastery-weak)      | Negative metrics |
| `--chart-4` | Amber (focus/learning)   | In-progress      |
| `--chart-5` | Gray (untested)          | Neutral/untested |

---

## 4. Spacing & Layout

**8pt Grid System:**

| Token      | Size | Dùng cho                |
| ---------- | ---- | ----------------------- |
| `space-1`  | 4px  | Icon gap, tight padding |
| `space-2`  | 8px  | Component internal gap  |
| `space-3`  | 12px | Label-to-input gap      |
| `space-4`  | 16px | Card padding, form gap  |
| `space-6`  | 24px | Card-to-card gap        |
| `space-8`  | 32px | Section padding         |
| `space-12` | 48px | Major section breaks    |
| `space-16` | 64px | Hero sections           |

**Desktop Layout (primary target):**

```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content area     │
│  ─ Logo                 │  (fluid, min 600px)    │
│  ─ Dashboard            │                        │
│  ─ Kế hoạch ôn tập      │  [react-flow canvas /  │
│  ─ Focus Session        │   chat UI / timeline]  │
│  ─ Hồ sơ                │                        │
└─────────────────────────────────────────────────┘
```

**Border Radius:** `--radius: 0.5rem` — cân bằng professional/friendly

---

## 5. Animation Tokens

| Token               | Giá trị                             | Dùng cho                        |
| ------------------- | ----------------------------------- | ------------------------------- |
| `--duration-fast`   | `150ms`                             | Hover, micro-interactions       |
| `--duration-normal` | `250ms`                             | Dialog open/close               |
| `--duration-slow`   | `400ms`                             | Page transitions, graph animate |
| `--ease-standard`   | `cubic-bezier(0.4, 0, 0.2, 1)`      | General transitions             |
| `--ease-spring`     | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Graph node pop-in               |
| `--ease-out`        | `cubic-bezier(0, 0, 0.2, 1)`        | Exit animations                 |

**Nguyên tắc:**
- Focus Session screen: Animation = **0** — không gây xao nhãng
- Graph DAG load: Nodes fade-in theo layer delay
- Remediate insert: `pulse-remediate` animation

---

## 6. Concept Graph — Node Styling

CSS classes cho react-flow nodes đã được định nghĩa trong `global.css`:

| Class                        | Score       | Visual                     |
| ---------------------------- | ----------- | -------------------------- |
| `.concept-node--strong`      | ≥ 0.8       | Emerald border + tinted bg |
| `.concept-node--learning`    | 0.6 – 0.8   | Amber border + tinted bg   |
| `.concept-node--weak`        | < 0.6       | Rose border + tinted bg    |
| `.concept-node--untested`    | `null`      | Gray dashed border         |
| `.concept-node--remediating` | Đang ôn lại | Orange pulsing border      |

**Mastery Score → Node State Mapping:**

```ts
type MasteryLevel = "strong" | "learning" | "weak" | "untested" | "remediating";

function getMasteryLevel(score: number | null, isRemediating = false): MasteryLevel {
  if (isRemediating) return "remediating";
  if (score === null) return "untested";
  if (score >= 0.8) return "strong";
  if (score >= 0.6) return "learning";
  return "weak";
}
```

---

## 7. AI Examiner Chat — Bubble Styling

| Class               | Alignment | Border Color | Dùng cho            |
| ------------------- | --------- | ------------ | ------------------- |
| `.chat-bubble-ai`   | Left      | Violet       | AI Examiner câu hỏi |
| `.chat-bubble-user` | Right     | Indigo       | Student câu trả lời |

---

## 8. Components (shadcn/ui — sẽ cài khi cần)

| Component        | Màn hình dùng                     | Lý do chọn                     |
| ---------------- | --------------------------------- | ------------------------------ |
| `Button`         | ✅ Đã cài — Toàn bộ                | CTA, actions                   |
| `Card`           | Dashboard, Results, Plan list     | Content container              |
| `Dialog`         | Xác nhận DAG, preview khái niệm   | Modal không mất context        |
| `Sheet`          | Chỉnh sửa concept details         | Side panel trên desktop        |
| `Form` + `Input` | Auth, Profile, Plan creation      | Validation với react-hook-form |
| `Textarea`       | AI Examiner input                 | Câu trả lời dài                |
| `ScrollArea`     | Chat history, concept list        | Scroll mượt                    |
| `Progress`       | Focus timer, mastery bar          | Linear progress                |
| `Badge`          | Mastery level, concept tags       | Color-coded status             |
| `Alert`          | Remediate notification, API error | Custom color variant           |
| `Skeleton`       | AI thinking, graph loading        | Loading state                  |
| `Toast` (Sonner) | Session saved, error              | Non-blocking notifications     |
| `Tabs`           | Dashboard sections, History       | Section switching              |
| `Avatar`         | User, AI Examiner                 | Profile + bot icon             |
| `Separator`      | Layout dividers                   | Vertical/horizontal            |
| `Tooltip`        | Graph node hover details          | Show mastery_score             |
| `DropdownMenu`   | User menu, concept actions        | Context actions                |
| `Select`         | Phương pháp học                   | Focus Session setup            |
| `Sidebar`        | Navigation chính                  | Collapsible support            |

---

## 9. Custom Components (sẽ build khi thiết kế xong trên Figma)

| Component        | Mô tả                                          |
| ---------------- | ---------------------------------------------- |
| `ConceptNode`    | Node trong đồ thị, dùng `.concept-node--*` CSS |
| `StudyPlanCard`  | Card + Badge + Progress + Button               |
| `ExaminerChat`   | ChatBubble + Input + SessionCounter            |
| `SessionCounter` | Hiển thị "Lượt 2/3"                            |
| `RemediateAlert` | Alert với `--remediate` color                  |
| `MasteryBadge`   | Badge color-coded + icon (accessibility)       |
| `AppSidebar`     | Sidebar navigation + logo + theme toggle       |

---

## 10. Accessibility

| Yêu cầu                          | Standard        | Áp dụng cho                  |
| -------------------------------- | --------------- | ---------------------------- |
| Text contrast                    | WCAG AA (4.5:1) | Mọi body text, chat bubbles  |
| Graph node contrast              | WCAG AA (3:1+)  | Node label trên colored bg   |
| Mastery color không dùng đơn độc | WCAG 1.4.1      | Kết hợp icon: ✅ 🔄 ⚠️ ❓        |
| Keyboard navigation              | WCAG 2.1.1      | react-flow keyboard pan/zoom |
| Focus indicators                 | Visible         | `--ring` = Indigo, 2px solid |
| `prefers-reduced-motion`         | WCAG 2.3.3      | Tắt pulse animation          |

---

## 11. Technical Notes

- **Tailwind version:** v4 — dùng `@theme inline` thay vì `tailwind.config.ts`
- **Color space:** oklch (native Tailwind v4) — không dùng HSL
- **shadcn style:** `radix-nova` (shadcn v4 latest)
- **Dark mode:** Via `.dark` class trên `<html>` — dark-first orientation
- **Custom Tailwind utilities:** Registered trong `@theme inline`:
  - `bg-mastery-strong`, `text-mastery-weak`, `border-remediate`, v.v.