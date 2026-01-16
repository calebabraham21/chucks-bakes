/**
 * Vercel Serverless Function for sending order confirmation emails
 * 
 * SECURITY NOTE:
 * The RESEND_API_KEY is stored as a server-side environment variable WITHOUT
 * the VITE_ prefix. This is critical because:
 * - Vite exposes any env var starting with VITE_ to the client bundle
 * - API keys must NEVER be exposed to the browser
 * - This serverless function runs on the server, so it can safely access the key
 */

/**
 * Generate HTML email template for order confirmation
 */
function generateEmailHtml(orderData) {
  const { orders, orderIds, customerEmail, customerName } = orderData;
  
  // Format order IDs for display
  const orderIdDisplay = orderIds.length === 1 
    ? orderIds[0] 
    : orderIds.join(', ');
  
  // Get fulfillment info from first order (they should all have same contact)
  const contact = orders[0]?.contact || {};
  const deliveryMethod = contact.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup';
  const targetDate = contact.targetDate || 'Not specified';
  
  // Generate items HTML
  const itemsHtml = orders.map((order, index) => {
    const itemType = order.itemType || 'Unknown Item';
    const itemLabel = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    
    let detailsHtml = '';
    
    if (order.itemType === 'cake' && order.config) {
      const config = order.config;
      detailsHtml = `
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.7;">
          <li><strong>Size:</strong> ${config.size || 'Not specified'}</li>
          <li><strong>Flavor:</strong> ${config.flavor || 'Not specified'}</li>
          <li><strong>Filling:</strong> ${config.filling || 'Not specified'}</li>
          <li><strong>Frosting:</strong> ${config.frostingFlavor || 'Not specified'}</li>
          ${config.toppings?.length ? `<li><strong>Toppings:</strong> ${config.toppings.join(', ')}</li>` : ''}
          ${config.writingText ? `<li><strong>Writing:</strong> "${config.writingText}" (${config.writingStyle || 'standard'})</li>` : ''}
          ${config.theme ? `<li><strong>Theme:</strong> ${config.theme}</li>` : ''}
          ${config.colors?.length ? `<li><strong>Colors:</strong> ${config.colors.join(', ')}</li>` : ''}
          ${config.specialRequests ? `<li><strong>Special Requests:</strong> ${config.specialRequests}</li>` : ''}
        </ul>
      `;
    } else if (order.order) {
      detailsHtml = `
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.7;">
          <li><strong>Quantity:</strong> ${order.order.quantity || 'Not specified'}</li>
        </ul>
      `;
    }
    
    return `
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin-bottom: 10px;">
        <h3 style="margin: 0 0 6px 0; color: #111827; font-size: 15px; font-weight: 600;">
          ${orders.length > 1 ? `Item ${index + 1}: ` : ''}${itemLabel}
        </h3>
        ${detailsHtml}
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Chuck's Bakes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Greeting -->
              <h1 style="margin: 0 0 16px 0; color: #111827; font-size: 22px; font-weight: 600;">
                Order Received
              </h1>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Hi ${customerName},<br><br>
                Thank you for your order! We've received your request and will be in touch within 24 hours to confirm the details and provide pricing.
              </p>
              
              <!-- Order ID Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Order ID</p>
                <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600; font-family: 'Inter', monospace; letter-spacing: 1px;">
                  ${orderIdDisplay}
                </p>
              </div>
              
              <!-- Fulfillment Info -->
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" style="padding: 4px 8px;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Fulfillment</p>
                      <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px; font-weight: 500;">${deliveryMethod}</p>
                    </td>
                    <td width="50%" style="padding: 4px 8px;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Target Date</p>
                      <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px; font-weight: 500;">${targetDate}</p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Order Items -->
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 16px; font-weight: 600;">
                Order Details
              </h2>
              ${itemsHtml}
              
              ${contact.notes ? `
              <!-- Notes -->
              <div style="margin-top: 16px; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
                <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Additional Notes</p>
                <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 14px;">${contact.notes}</p>
              </div>
              ` : ''}
              
              <!-- What's Next -->
              <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 600;">
                  What happens next?
                </h2>
                <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                  <li>We'll review your order details</li>
                  <li>We'll reach out within 24 hours with pricing and to confirm availability</li>
                  <li>Once confirmed, we'll let you know when your treats will be ready</li>
                </ol>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                Questions? Reply to this email or contact us at
                <a href="mailto:orders@chucksbakes.com" style="color: #111827; font-weight: 500; text-decoration: none;">
                  orders@chucksbakes.com
                </a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Get the Resend API key from environment variables
    // SECURITY: This key is NOT prefixed with VITE_ so it stays server-side only
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured' 
      });
    }

    const { orders, orderIds } = req.body;

    // Validate required fields
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing or invalid orders data' 
      });
    }

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing order IDs' 
      });
    }

    // Get customer info from the first order (should be same across all items)
    const contact = orders[0]?.contact;
    if (!contact || !contact.email || !contact.name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing customer contact information' 
      });
    }

    const customerEmail = contact.email;
    const customerName = contact.name;

    // Generate order ID display for subject line
    const orderIdDisplay = orderIds.length === 1 
      ? orderIds[0] 
      : `${orderIds[0]} (+${orderIds.length - 1} more)`;

    // Generate email HTML
    const htmlContent = generateEmailHtml({
      orders,
      orderIds,
      customerEmail,
      customerName,
    });

    // Send email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Chuck's Bakes <orders@chucksbakes.com>",
        to: [customerEmail],
        reply_to: 'orders@chucksbakes.com',
        subject: `Order Received: ${orderIdDisplay}`,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', emailResult);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send confirmation email',
        error: emailResult.message || 'Unknown email error'
      });
    }

    console.log('Confirmation email sent successfully to:', customerEmail);
    return res.status(200).json({ 
      success: true, 
      message: 'Confirmation email sent',
      emailId: emailResult.id
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while sending the confirmation email' 
    });
  }
}
