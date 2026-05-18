import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, EmptyState, FormError, Loading } from './Feedback';

describe('Feedback components', () => {
  it('Loading renders a spinner role', () => {
    render(<Loading />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('Alert shows the message and the close button when onClose is provided', async () => {
    const onClose = vi.fn();
    render(<Alert type="error" message="Oops" onClose={onClose} />);
    expect(screen.getByText('Oops')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Alert hides the close button when onClose is missing', () => {
    render(<Alert type="info" message="Hola" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('FormError returns nothing when there is no message', () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it('FormError renders the validation message in red', () => {
    render(<FormError message="Campo requerido" />);
    const el = screen.getByText('Campo requerido');
    expect(el).toHaveClass('text-red-600');
  });

  it('EmptyState falls back to a default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });
});
