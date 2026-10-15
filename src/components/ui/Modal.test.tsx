import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

function renderModal(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <>
      <button type="button">Outside</button>
      <Modal isOpen={isOpen} onClose={onClose} title="Your Cart">
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>
    </>,
  );
}

describe('Modal', () => {
  // jsdom doesn't implement inert semantics, so only the attribute is asserted here.
  it('is inert while closed', () => {
    const { container, rerender } = renderModal(false);
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog?.closest('[inert]')).not.toBeNull();

    rerender(
      <Modal isOpen onClose={vi.fn()} title="Your Cart">
        <button type="button">First</button>
      </Modal>,
    );
    expect(container.querySelector('[inert]')).toBeNull();
  });

  it('exposes a labelled dialog and closes on Escape when open', async () => {
    const onClose = vi.fn();
    renderModal(true, onClose);
    expect(screen.getByRole('dialog', { name: 'Your Cart' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    renderModal(true);
    screen.getByRole('button', { name: 'Last' }).focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close modal' }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last' }));
  });
});
