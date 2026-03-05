/**
 * Skenario Pengujian (React Component) - ThreadCard
 * - harus menampilkan judul thread dan link ke halaman detail
 * - harus menampilkan nama owner (atau 'Anon' jika tidak ada)
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ThreadCard from '../ThreadCard';

// Mock child component agar test fokus pada ThreadCard
vi.mock('../VoteButtons', () => ({
  default: () => <div data-testid="vote-buttons" />,
}));

// Stabilkan util agar tidak bergantung pada format tanggal/HTML
vi.mock('../../../utils/format', () => ({
  excerpt: (text) => text.slice(0, 10),
  formatDate: () => '2026-01-01',
}));

describe('ThreadCard component', () => {
  it('harus menampilkan judul dan link yang benar', () => {
    const thread = {
      id: 't1',
      title: 'Judul Thread',
      body: 'Isi thread panjang',
      category: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };
    const owner = { name: 'Rizqi', avatar: 'x' };

    render(
      <MemoryRouter>
        <ThreadCard thread={thread} owner={owner} />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Judul Thread' });
    expect(link).toHaveAttribute('href', '/threads/t1');
    expect(screen.getByText('Rizqi')).toBeInTheDocument();
  });

  it('harus fallback ke Anon jika owner tidak ada', () => {
    const thread = {
      id: 't2',
      title: 'Thread 2',
      body: 'Isi',
      category: '',
      createdAt: '2026-01-01T00:00:00.000Z',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 1,
    };

    render(
      <MemoryRouter>
        <ThreadCard thread={thread} owner={null} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Anon')).toBeInTheDocument();
  });
});
