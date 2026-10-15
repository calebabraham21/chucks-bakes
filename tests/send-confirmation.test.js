import { afterEach, describe, expect, it, vi } from 'vitest';
import handler, { escapeHtml, generateEmailHtml } from '../api/send-confirmation.js';

const order = (overrides = {}) => ({
  itemType: 'cake',
  config: { size: '6in-3layer', flavor: 'vanilla', filling: 'none', frostingFlavor: 'vanilla', toppings: ['sprinkles'], colors: 'pink, sage', ...overrides },
  contact: { name: 'Jane', email: 'jane@example.com', phone: '5551234567', deliveryMethod: 'pickup', targetDate: '2026-11-20', notes: '' },
});

function mockRes() {
  const res = { statusCode: 0, body: undefined };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  return res;
}

describe('escapeHtml', () => {
  it('escapes markup characters', () => {
    expect(escapeHtml(`<a href="x">Tom & Jerry's</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;');
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('generateEmailHtml', () => {
  it('renders free-text colors (the order form sends a string)', () => {
    const html = generateEmailHtml({ orders: [order()], orderIds: ['CB-1'], customerName: 'Jane' });
    expect(html).toContain('<strong>Colors:</strong> pink, sage');
  });

  it('escapes customer-supplied fields', () => {
    const html = generateEmailHtml({
      orders: [order({ theme: '<img src=x onerror=alert(1)>', specialRequests: '<a href="https://evil.example">click</a>' })],
      orderIds: ['CB-1'],
      customerName: '<b>Jane</b>',
    });
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<a href="https://evil.example">');
    expect(html).toContain('Hi &lt;b&gt;Jane&lt;/b&gt;');
  });
});

describe('send-confirmation handler', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it('sends the email through Resend', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'email_1' }) });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const res = mockRes();
    await handler({ method: 'POST', body: { orders: [order()], orderIds: ['CB-1'] } }, res);

    expect(res.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.to).toEqual(['jane@example.com']);
    expect(payload.html).toContain('pink, sage');
  });

  it('rejects non-POST requests', async () => {
    const res = mockRes();
    await handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(405);
  });
});
