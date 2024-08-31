import { describe, it, expect } from 'bun:test';

import { getUrl } from 'utils/getURL';

describe('getUrl', () => {
  it('should work with simple urls', () => {
    expect(getUrl('https://www.google.fr')).toEqual(new URL('https://www.google.fr'));
    expect(getUrl('https://github.com/e-krebs/pile')).toEqual(
      new URL('https://github.com/e-krebs/pile')
    );
  });

  it('should work with known edge cases', () => {
    expect(getUrl('svg.wtf')).toEqual(new URL('https://svg.wtf'));
  });
});
