import { paginate } from './paginate';

const items = Array.from({ length: 35 }, (_, i) => i + 1);

describe('paginate', () => {
  it('reports a single page when items fit', () => {
    const result = paginate([1, 2, 3], 1, 30);
    expect(result.pageCount).toBe(1);
    expect(result.items).toEqual([1, 2, 3]);
  });

  it('splits into pages of the given size', () => {
    expect(paginate(items, 1, 30).items).toHaveLength(30);
    expect(paginate(items, 2, 30).items).toHaveLength(5);
    expect(paginate(items, 2, 30).pageCount).toBe(2);
  });

  it('clamps an out-of-range page into bounds', () => {
    expect(paginate(items, 99, 30).page).toBe(2);
    expect(paginate(items, 0, 30).page).toBe(1);
  });

  it('always reports at least one page, even when empty', () => {
    expect(paginate([], 1, 30).pageCount).toBe(1);
  });
});
