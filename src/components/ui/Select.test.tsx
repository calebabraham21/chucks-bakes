import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'spice', label: 'Spice' },
];

function Harness() {
  const [value, setValue] = useState('');
  return <Select label="Cake Flavor" options={options} placeholder="Select a flavor" value={value} onChange={setValue} />;
}

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = () => {};

describe('Select', () => {
  it('is labelled and starts collapsed', () => {
    render(<Harness />);
    const combobox = screen.getByRole('combobox', { name: 'Cake Flavor' });
    expect(combobox).toHaveProperty('textContent', 'Select a flavor');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports keyboard selection', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const combobox = screen.getByRole('combobox', { name: 'Cake Flavor' });
    combobox.focus();

    await user.keyboard('{ArrowDown}');
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(combobox.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Vanilla' }).id);

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(combobox.textContent).toBe('Coconut');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    await user.keyboard('{Enter}{End} ');
    expect(combobox.textContent).toBe('Spice');
  });

  it('jumps to options by first letter and closes on Escape without selecting', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const combobox = screen.getByRole('combobox', { name: 'Cake Flavor' });
    combobox.focus();

    await user.keyboard('{Enter}c');
    expect(combobox.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Chocolate' }).id);
    await user.keyboard('c');
    expect(combobox.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Coconut' }).id);

    await user.keyboard('{Escape}');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(combobox.textContent).toBe('Select a flavor');
  });

  it('selects with the mouse', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('combobox', { name: 'Cake Flavor' }));
    await user.click(screen.getByRole('option', { name: 'Chocolate' }));
    expect(screen.getByRole('combobox', { name: 'Cake Flavor' }).textContent).toBe('Chocolate');
  });
});
