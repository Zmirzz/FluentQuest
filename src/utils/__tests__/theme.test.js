const { getReadableTextColor } = require('../theme');

describe('getReadableTextColor', () => {
  test('returns white text on dark background', () => {
    const result = getReadableTextColor('#000000');
    expect(result.color).toBe('#FFFFFF');
    expect(result.style.color).toBe('#FFFFFF');
  });

  test('returns black text on light background', () => {
    const result = getReadableTextColor('#FFFFFF');
    expect(result.color).toBe('#000000');
    expect(result.style.color).toBe('#000000');
  });
});
