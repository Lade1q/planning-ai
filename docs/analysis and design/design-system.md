# Recall AI — Design System

## 1. Tokens
Xem `src/index.css` — toàn bộ màu sắc, radius, font.

## 2. Typography
Font: Geist Variable
| Role            | Class Tailwind        | Size |
| --------------- | --------------------- | ---- |
| Page title      | text-2xl font-bold    | 24px |
| Section heading | text-xl font-semibold | 20px |
| Card title      | text-base font-medium | 16px |
| Body            | text-sm               | 14px |
| Label/Caption   | text-xs               | 12px |

## 3. Màu đặc thù Recall AI
| Token              | Dùng cho                |
| ------------------ | ----------------------- |
| --concept-mastered | Node khái niệm đã vững  |
| --concept-weak     | Node khái niệm còn yếu  |
| --concept-untested | Node chưa được kiểm tra |

## 4. Components (từ shadcn/ui)
| Component      | Dùng ở đâu                       |
| -------------- | -------------------------------- |
| Button         | Mọi CTA, submit, action          |
| Card           | StudyPlanCard, màn Dashboard     |
| Badge          | Tag trạng thái vững/yếu/chưa học |
| Progress       | Mastery score bar                |
| Input/Textarea | Ô nhập câu trả lời Examiner      |
| Dialog         | Modal xác nhận, popup            |
| Tabs           | Upload (PDF/text/ảnh)            |
| Avatar         | User profile sidebar             |

## 5. Custom Components (tự build)
| Component      | Mô tả                                      |
| -------------- | ------------------------------------------ |
| ConceptNode    | Node trong đồ thị, dùng --concept-* tokens |
| StudyPlanCard  | Card + Badge + Progress + Button           |
| ExaminerChat   | ChatBubble + Input + SessionCounter        |
| SessionCounter | Hiển thị "Lượt 2/3"                        |