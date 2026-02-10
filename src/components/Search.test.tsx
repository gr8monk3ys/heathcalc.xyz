import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  createLogger: () => ({
    logError: vi.fn(),
    logWarn: vi.fn(),
    logInfo: vi.fn(),
  }),
}));

// Mock fetch for search index
const mockSearchIndex = {
  bmi: {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index',
    url: '/bmi',
    type: 'calculator' as const,
    category: 'Body Composition',
    tags: ['bmi', 'weight', 'health'],
    content: 'Body mass index calculator for adults and children',
  },
  tdee: {
    title: 'TDEE Calculator',
    description: 'Calculate Total Daily Energy Expenditure',
    url: '/tdee',
    type: 'calculator' as const,
    category: 'Metabolism',
    tags: ['tdee', 'calories', 'metabolism'],
  },
  blogPost: {
    title: 'Best BMI Scales',
    description: 'Top rated scales for BMI tracking',
    url: '/blog/best-bmi-scales',
    type: 'article' as const,
    category: 'Reviews',
    tags: ['bmi', 'scales', 'review'],
  },
};

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockSearchIndex),
    });
  });

  describe('Rendering', () => {
    it('should render search input', () => {
      render(<Search />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<Search placeholder="Find a calculator..." />);
      expect(screen.getByPlaceholderText('Find a calculator...')).toBeInTheDocument();
    });

    it('should render default placeholder', () => {
      render(<Search />);
      expect(screen.getByPlaceholderText('Search calculators, articles...')).toBeInTheDocument();
    });

    it('should render search icon by default', () => {
      const { container } = render(<Search />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should hide search icon when showIcon is false', () => {
      const { container } = render(<Search showIcon={false} />);
      // The only SVGs should not include the search icon in the input area
      const searchForm = container.querySelector('form');
      const iconContainer = searchForm?.querySelector('.pointer-events-none svg');
      expect(iconContainer).toBeNull();
    });

    it('should render with initial query', () => {
      render(<Search initialQuery="bmi" />);
      expect(screen.getByRole('searchbox')).toHaveValue('bmi');
    });

    it('should apply custom className', () => {
      const { container } = render(<Search className="w-full" />);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('should have search role on form', () => {
      render(<Search />);
      expect(screen.getByRole('search')).toBeInTheDocument();
    });

    it('should have aria-label on input', () => {
      render(<Search />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });
  });

  describe('Search behavior', () => {
    it('should not show results for single character input', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'b' } });

      await waitFor(() => {
        expect(screen.queryByText('BMI Calculator')).not.toBeInTheDocument();
      });
    });

    it('should show results for queries >= 2 characters', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      // Wait for search index to load
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/search-index.json');
      });

      fireEvent.change(input, { target: { value: 'bmi' } });

      await waitFor(() => {
        expect(screen.getByText('BMI Calculator')).toBeInTheDocument();
      });
    });

    it('should clear results when input is cleared', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });
      await waitFor(() => {
        expect(screen.getByText('BMI Calculator')).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.queryByText('BMI Calculator')).not.toBeInTheDocument();
      });
    });

    it('should call onSearch callback with results', async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('bmi', expect.any(Array));
      });
    });
  });

  describe('Form submission', () => {
    it('should navigate to search page on submit', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'bmi' } });
      fireEvent.submit(input.closest('form')!);

      expect(mockPush).toHaveBeenCalledWith('/search?q=bmi');
    });

    it('should not navigate when query is too short', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'b' } });
      fireEvent.submit(input.closest('form')!);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should URL-encode the query', () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      fireEvent.change(input, { target: { value: 'body fat %' } });
      fireEvent.submit(input.closest('form')!);

      expect(mockPush).toHaveBeenCalledWith('/search?q=body%20fat%20%25');
    });
  });

  describe('Result display', () => {
    it('should show result descriptions', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });

      await waitFor(() => {
        expect(screen.getByText('Calculate your Body Mass Index')).toBeInTheDocument();
      });
    });

    it('should show category badges', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });

      await waitFor(() => {
        expect(screen.getByText('Body Composition')).toBeInTheDocument();
      });
    });

    it('should show "View all results" link when results exist', async () => {
      render(<Search />);
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });

      await waitFor(() => {
        expect(screen.getByText(/view all results/i)).toBeInTheDocument();
      });
    });
  });

  describe('Click outside', () => {
    it('should close results when clicking outside', async () => {
      render(
        <div>
          <Search />
          <div data-testid="outside">Outside</div>
        </div>
      );
      const input = screen.getByRole('searchbox');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      fireEvent.change(input, { target: { value: 'bmi' } });
      await waitFor(() => {
        expect(screen.getByText('BMI Calculator')).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByTestId('outside'));
      await waitFor(() => {
        expect(screen.queryByText('BMI Calculator')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle fetch error gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<Search />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Component should still be functional with empty index
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'bmi' } });

      // Should not crash
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });
});
