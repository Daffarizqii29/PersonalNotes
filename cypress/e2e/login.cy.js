/**
 * Skenario Pengujian (E2E) - Alur Login
 * - Pengguna membuka halaman /login
 * - Mengisi email & password
 * - Menekan tombol Login
 * - Aplikasi memanggil API /login dan /users/me (di-mock)
 * - Pengguna berhasil diarahkan ke halaman /threads dan melihat judul "Daftar Thread"
 */

describe('Login Flow', () => {
  it('harus berhasil login dan redirect ke halaman threads', () => {
    const apiBase = 'https://forum-api.dicoding.dev/v1';

    cy.intercept('POST', `${apiBase}/login`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { token: 'token-test' },
      },
    }).as('login');

    cy.intercept('GET', `${apiBase}/users/me`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { user: { id: 'u1', name: 'User Test', avatar: '' } },
      },
    }).as('me');

    // Halaman threads akan mem-fetch users & threads saat mount, jadi kita mock juga.
    cy.intercept('GET', `${apiBase}/users`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { users: [{ id: 'u1', name: 'User Test', avatar: '' }] },
      },
    }).as('users');

    cy.intercept('GET', `${apiBase}/threads`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { threads: [] },
      },
    }).as('threads');

    cy.visit('/login');

    cy.get('#email').type('user@test.com');
    cy.get('#password').type('password123');
    cy.contains('button', 'Login').click();

    cy.wait('@login');
    cy.wait('@me');
    cy.url().should('include', '/threads');
    cy.contains('h1', 'Daftar Thread').should('be.visible');
  });
});
