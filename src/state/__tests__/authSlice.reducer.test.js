/**
 * Skenario Pengujian (Reducer) - authSlice
 * - logout()
 *   - harus menghapus token & user
 *   - harus mereset status menjadi 'idle' dan error menjadi null
 */

import authReducer, { logout } from '../authSlice';

describe('authSlice reducer', () => {
  it('harus mereset state saat logout dipanggil', () => {
    const prevState = {
      token: 'token-123',
      user: { id: 'u1', name: 'Rizqi' },
      status: 'succeeded',
      error: 'some error',
      isBootstrapped: true,
    };

    const nextState = authReducer(prevState, logout());

    expect(nextState.token).toBe(null);
    expect(nextState.user).toBe(null);
    expect(nextState.status).toBe('idle');
    expect(nextState.error).toBe(null);
    // isBootstrapped tidak diubah oleh logout
    expect(nextState.isBootstrapped).toBe(true);
  });
});
