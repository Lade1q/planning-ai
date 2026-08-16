import { render, screen } from '@/utils/test-utils';
import { describe, it, expect } from 'vitest';
import { DocumentExcerpt } from './DocumentExcerpt';
import { isTruncatedQuote } from '../utils/format';
import type { ConceptSourceExcerpt } from '@/features/study-planner/types/concept';

function source(over: Partial<ConceptSourceExcerpt> = {}): ConceptSourceExcerpt {
  return {
    documentId: 'doc-1',
    filename: 'ctdl.pdf',
    kind: 'pdf',
    pageFrom: 41,
    pageTo: 43,
    excerpt: 'Ngăn xếp là cấu trúc dữ liệu tuyến tính theo nguyên tắc LIFO.',
    ...over,
  };
}

/**
 * Mức "Trích đoạn" của FS-04 (#227). Tô SÁNG CẢ ĐOẠN (excerpt = câu định nghĩa verbatim), không tô
 * lẻ tên khái niệm bên trong, và KHÔNG có tiêu đề mục bịa — chỉ tên tệp + trang + câu trích.
 */
describe('DocumentExcerpt (FS-04)', () => {
  it('tô sáng nguyên câu trích trong một <mark> duy nhất', () => {
    const { container } = render(<DocumentExcerpt sources={[source()]} />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe(
      'Ngăn xếp là cấu trúc dữ liệu tuyến tính theo nguyên tắc LIFO.'
    );
  });

  it('hiện tên tệp và neo trang dựng từ pageFrom/pageTo, KHÔNG dựng tiêu đề mục giả', () => {
    const { container } = render(<DocumentExcerpt sources={[source()]} />);
    expect(screen.getByText('ctdl.pdf')).toBeInTheDocument();
    expect(screen.getByText('tr. 41–43')).toBeInTheDocument();
    // Không có heading nào — tiêu đề mục tài liệu là dữ liệu schema không có, không được bịa.
    expect(container.querySelector('h1,h2,h3,h4,h5,h6')).toBeNull();
  });

  it('nhiều nguồn → mỗi nguồn một khối docbar riêng, xếp theo thứ tự truyền vào', () => {
    render(
      <DocumentExcerpt
        sources={[
          source({ documentId: 'a', filename: 'chuong-1.pdf', pageFrom: 41, pageTo: 41 }),
          source({ documentId: 'b', filename: 'chuong-2.pdf', pageFrom: 88, pageTo: 88 }),
        ]}
      />
    );
    expect(screen.getByText('chuong-1.pdf')).toBeInTheDocument();
    expect(screen.getByText('chuong-2.pdf')).toBeInTheDocument();
    expect(screen.getByText('tr. 41')).toBeInTheDocument();
    expect(screen.getByText('tr. 88')).toBeInTheDocument();
  });

  it('nguồn có neo trang nhưng không có câu trích → nói rõ, không để trống', () => {
    const { container } = render(<DocumentExcerpt sources={[source({ excerpt: null })]} />);
    expect(container.querySelector('mark')).toBeNull();
    expect(screen.getByText(/chỉ có neo vị trí/)).toBeInTheDocument();
  });

  /**
   * #373 — dấu hiệu trích dẫn. 46/67 mẩu trong DB không kết bằng dấu câu (bullet slide PDF), nên
   * bày trần thì đọc ra như một câu trọn vẹn có thật trong tệp.
   *
   * Ngoặc kép và `…` phải nằm **ngoài** `<mark>`: chúng là dấu hiệu của app, không phải chữ trong
   * tài liệu. Ca đầu của tệp này (`marks[0].textContent` đúng bằng excerpt) chính là chốt giữ điều
   * đó — nếu ai nhét chúng vào trong vùng tô sáng thì ca ấy đỏ.
   */
  it('bọc câu trích trong ngoặc kép, và ngoặc nằm NGOÀI vùng tô sáng', () => {
    const { container } = render(<DocumentExcerpt sources={[source()]} />);

    const paragraph = container.querySelector('p');
    expect(paragraph?.textContent).toBe(
      '“Ngăn xếp là cấu trúc dữ liệu tuyến tính theo nguyên tắc LIFO.”'
    );
    // Vùng tô sáng vẫn chỉ chứa đúng chữ của tài liệu.
    expect(container.querySelector('mark')?.textContent).toBe(
      'Ngăn xếp là cấu trúc dữ liệu tuyến tính theo nguyên tắc LIFO.'
    );
  });

  it('thêm … khi mẩu trích cụt giữa chừng (bullet slide, không có dấu kết câu)', () => {
    const { container } = render(
      <DocumentExcerpt sources={[source({ excerpt: 'Tầng Mạng trong mô hình TCP/IP' })]} />
    );

    expect(container.querySelector('p')?.textContent).toBe('“Tầng Mạng trong mô hình TCP/IP…”');
    // `…` cũng ở ngoài vùng tô sáng — tài liệu không có ký tự đó.
    expect(container.querySelector('mark')?.textContent).toBe('Tầng Mạng trong mô hình TCP/IP');
  });

  it('KHÔNG thêm … khi câu trích đã kết bằng dấu câu', () => {
    const { container } = render(
      <DocumentExcerpt
        sources={[source({ excerpt: 'Ngăn xếp hoạt động theo nguyên tắc LIFO!' })]}
      />
    );

    expect(container.querySelector('p')?.textContent).not.toContain('…');
  });
});

describe('isTruncatedQuote (#373)', () => {
  it.each([
    ['Tầng Mạng trong mô hình TCP/IP', true],
    ['Version: IPv4 / IPv5 / IPv6', true],
    ['Ngăn xếp là cấu trúc LIFO.', false],
    ['Ngăn xếp là gì?', false],
    ['Chú ý!', false],
    ['Đã lược bớt…', false],
    ['Ông ấy nói "xong."', false],
    // Khoảng trắng cuối không được biến một câu hoàn chỉnh thành câu cụt.
    ['Ngăn xếp là cấu trúc LIFO.   ', false],
    // `:` dẫn vào một danh sách đã bị cắt mất ⇒ CỤT, không phải trọn vẹn.
    ['Các loại địa chỉ IP:', true],
    ['Ba tầng gồm;', true],
  ])('%s → %s', (excerpt, expected) => {
    expect(isTruncatedQuote(excerpt)).toBe(expected);
  });
});
