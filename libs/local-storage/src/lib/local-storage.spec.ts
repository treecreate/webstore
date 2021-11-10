import { localStorage } from './local-storage';

describe('localStorage', () => {
  it('should work', () => {
    expect(localStorage()).toEqual('local-storage');
  });
});
