/**
 * Google Apps Script for Chuck's Bakes Order Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet called "Orders"
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click the "Deploy" button > New deployment
 * 5. Choose type: Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Generate a secure random token (e.g., a long random string)
 * 10. Add the token to Script Properties:
 *     - Click Project Settings (gear icon)
 *     - Scroll to Script Properties
 *     - Add property: API_TOKEN with your secure token value
 * 11. Use the Web App URL as VITE_GOOGLE_SCRIPT_URL in your .env file
 * 12. Use the token as API_ORDER_TOKEN in your .env file
 */

// Property key for the API token
const TOKEN_PROPERTY = 'API_TOKEN';

// Merchant notification email — change this to whatever address should receive new-order alerts.
// IMPORTANT: The script owner must authorize the Mail service the first time this script is
// run or deployed. Google will show an OAuth consent screen asking for "Send email on your behalf"
// permission. You can trigger it by running testSetup() or testOrderSubmission() manually in the
// Apps Script editor after saving, then accepting the permission prompt.
const MERCHANT_NOTIFY_EMAIL = 'chucksbakes@gmail.com';

// Maximum open orders per customer (checked by phone number)
const MAX_OPEN_ORDERS_PER_CUSTOMER = 1;

// Statuses that count as "closed" (not counted against the limit)
const CLOSED_STATUSES = ['Completed', 'Cancelled', 'Declined'];

/**
 * Generate a unique order ID in format CB-YYMMDD-XXXX
 */
function generateOrderId() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // Last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit random number
  
  return `CB-${year}${month}${day}-${random}`;
}

/**
 * Count open orders for a given phone number
 * Returns the number of orders where status is NOT in CLOSED_STATUSES
 */
function countOpenOrdersByPhone(sheet, phone) {
  if (!phone || sheet.getLastRow() <= 1) {
    return 0;
  }
  
  // Normalize phone (digits only)
  const normalizedPhone = phone.replace(/\D/g, '');
  if (!normalizedPhone) {
    return 0;
  }
  
  const data = sheet.getDataRange().getValues();
  let openCount = 0;
  
  // Column indices (0-based)
  const STATUS_COL = 2;  // Column C - Status
  const PHONE_COL = 6;   // Column G - Phone
  
  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][PHONE_COL] || '').replace(/\D/g, '');
    const rowStatus = String(data[i][STATUS_COL] || '').trim();
    
    if (rowPhone === normalizedPhone && !CLOSED_STATUSES.includes(rowStatus)) {
      openCount++;
    }
  }
  
  return openCount;
}

/**
 * Handle POST requests from the order form
 * Format: { itemType, config/order, contact, orderId (optional), skipLimitCheck (optional) }
 */
function doPost(e) {
  try {
    // Parse the request
    const data = JSON.parse(e.postData.contents);
    
    Logger.log('=== INCOMING ORDER ===');
    Logger.log('Raw data: ' + JSON.stringify(data).substring(0, 500));
    Logger.log('Item type: ' + data.itemType);
    Logger.log('orderId received: "' + data.orderId + '" (type: ' + typeof data.orderId + ')');
    Logger.log('skipLimitCheck received: "' + data.skipLimitCheck + '" (type: ' + typeof data.skipLimitCheck + ')');
    
    // Verify the token
    const providedToken = data.token;
    const expectedToken = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
    
    if (!expectedToken) {
      return createResponse(500, 'Server configuration error: Token not set');
    }
    
    if (providedToken !== expectedToken) {
      Logger.log('Authentication failed');
      return createResponse(401, 'Unauthorized');
    }
    
    // Get the Orders sheet
    const sheet = getOrdersSheet();
    
    // Check if this is the first row (needs headers)
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet);
    }
    
    // Validate contact info
    if (!data.contact || !data.contact.phone) {
      Logger.log('ERROR: Missing contact/phone');
      return createResponse(400, 'Missing contact information');
    }
    
    const phone = data.contact.phone;
    
    // Check skipLimitCheck - handle both boolean and string "true"
    const shouldSkipCheck = data.skipLimitCheck === true || data.skipLimitCheck === 'true';
    
    if (shouldSkipCheck) {
      Logger.log('SKIPPING limit check');
    } else {
      Logger.log('Checking limit for phone: ' + phone);
      const openOrders = countOpenOrdersByPhone(sheet, phone);
      Logger.log('Open orders found: ' + openOrders);
      
      if (openOrders >= MAX_OPEN_ORDERS_PER_CUSTOMER) {
        Logger.log('BLOCKED: Order limit reached');
        return createResponse(429, 'You already have a pending order! Please wait for it to be completed before placing a new one.', { 
          success: false, 
          errorCode: 'ORDER_LIMIT_REACHED',
          openOrders: openOrders,
          maxAllowed: MAX_OPEN_ORDERS_PER_CUSTOMER
        });
      }
      Logger.log('Limit check PASSED');
    }
    
    // Use provided orderId or generate new one
    const orderId = (data.orderId && data.orderId !== 'undefined') ? data.orderId : generateOrderId();
    Logger.log('Final Order ID: ' + orderId);
    
    // Add the order row
    addOrderRow(sheet, data, orderId);

    Logger.log('=== SUCCESS: Row added ===');

    // Send merchant notification — failures here must never block the success response
    try {
      sendMerchantNotification(data, orderId);
    } catch (notifyError) {
      Logger.log('Merchant notification failed (non-fatal): ' + notifyError.toString());
    }

    return createResponse(200, 'Order received successfully', { success: true, orderId: orderId });
    
  } catch (error) {
    Logger.log('=== ERROR: ' + error.toString() + ' ===');
    return createResponse(500, 'An error occurred while processing your order. Please try again.');
  }
}

/**
 * Get or create the Orders sheet
 */
function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Orders');
  
  if (!sheet) {
    sheet = ss.insertSheet('Orders');
  }
  
  return sheet;
}

/**
 * Add header row to the sheet with granular columns
 */
function addHeaders(sheet) {
  const headers = [
    'Order ID',
    'Timestamp',
    'Status',
    'Item Type',
    // Contact Info
    'Name',
    'Email', 
    'Phone',
    'Delivery Method',
    'Target Date',
    'Notes',
    // Cake Config
    'Size',
    'Quantity',
    'Flavor',
    'Filling',
    'Frosting Flavor',
    'Toppings',
    'Writing Style',
    'Writing Text',
    'Theme',
    'Colors',
    'Special Requests'
  ];
  
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#000000');
  headerRange.setFontColor('#ffffff');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Add an order row to the sheet with granular data
 */
function addOrderRow(sheet, data, orderId) {
  const timestamp = new Date();
  const contact = data.contact || {};
  
  Logger.log('Adding row - itemType: ' + data.itemType + ', hasConfig: ' + !!data.config + ', hasOrder: ' + !!data.order);
  
  // Initialize all columns with empty values
  let row = {
    orderId: orderId,
    timestamp: timestamp,
    status: 'New',
    itemType: data.itemType || '',
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    deliveryMethod: contact.deliveryMethod || 'pickup',
    targetDate: contact.targetDate || '',
    notes: contact.notes || '',
    size: '',
    quantity: '',
    flavor: '',
    filling: '',
    frostingFlavor: '',
    toppings: '',
    writingStyle: '',
    writingText: '',
    theme: '',
    colors: '',
    specialRequests: ''
  };
  
  // Fill in item-specific details
  if (data.itemType === 'cake' && data.config) {
    const config = data.config;
    row.size = config.size || '';
    row.quantity = '1 cake';
    row.flavor = config.flavor || '';
    row.filling = config.filling || '';
    row.frostingFlavor = config.frostingFlavor || '';
    row.toppings = (config.toppings && config.toppings.length > 0) ? config.toppings.join(', ') : '';
    row.writingStyle = config.writingStyle || '';
    row.writingText = config.writingText || '';
    row.theme = config.theme || '';
    row.colors = (config.colors && config.colors.length > 0) ? config.colors.join(', ') : '';
    row.specialRequests = config.specialRequests || '';
    
  } else if (data.order) {
    // Brownies, cookies
    row.size = 'N/A';
    row.quantity = data.order.quantity ? String(data.order.quantity) : '';
    row.flavor = 'N/A';
    row.filling = 'N/A';
    row.frostingFlavor = 'N/A';
    row.toppings = 'N/A';
    row.writingStyle = 'N/A';
    row.writingText = 'N/A';
    row.theme = 'N/A';
    row.colors = 'N/A';
    row.specialRequests = 'N/A';
  }
  
  Logger.log('Row data: ' + row.itemType + ', qty: ' + row.quantity);
  
  // Convert row object to array in the correct column order
  const rowArray = [
    row.orderId,
    row.timestamp,
    row.status,
    row.itemType,
    row.name,
    row.email,
    row.phone,
    row.deliveryMethod,
    row.targetDate,
    row.notes,
    row.size,
    row.quantity,
    row.flavor,
    row.filling,
    row.frostingFlavor,
    row.toppings,
    row.writingStyle,
    row.writingText,
    row.theme,
    row.colors,
    row.specialRequests
  ];
  
  sheet.appendRow(rowArray);
  
  // Auto-resize columns after adding data
  const lastRow = sheet.getLastRow();
  for (let i = 1; i <= rowArray.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Add alternating row colors
  if (lastRow > 1) {
    const dataRange = sheet.getRange(lastRow, 1, 1, rowArray.length);
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#fff5f7');
    }
  }
}

/**
 * Send a plain-text notification email to the merchant after an order is saved.
 * Uses MailApp, which counts against the Gmail daily send quota (~100/day for personal,
 * 1,500/day for Workspace). Errors are caught by the caller and logged, not re-thrown.
 */
function sendMerchantNotification(data, orderId) {
  const contact = data.contact || {};
  const config  = data.config  || {};
  const order   = data.order   || {};

  const subject = 'New Chuck\'s Bakes order: ' + orderId;

  // Build a compact plain-text body with the essentials for quick triage
  const lines = [
    'New order received on Chuck\'s Bakes.',
    '',
    'ORDER ID:    ' + orderId,
    'ITEM TYPE:   ' + (data.itemType || 'unknown'),
    '',
    '--- Customer ---',
    'Name:        ' + (contact.name  || ''),
    'Email:       ' + (contact.email || ''),
    'Phone:       ' + (contact.phone || ''),
    'Target Date: ' + (contact.targetDate || ''),
    'Notes:       ' + (contact.notes || '(none)'),
    '',
  ];

  // Cake-specific details
  if (data.itemType === 'cake' && data.config) {
    lines.push('--- Cake Details ---');
    lines.push('Size:        ' + (config.size          || ''));
    lines.push('Flavor:      ' + (config.flavor        || ''));
    lines.push('Filling:     ' + (config.filling       || ''));
    lines.push('Frosting:    ' + (config.frostingFlavor || ''));

    const toppings = (config.toppings && config.toppings.length > 0)
      ? config.toppings.join(', ')
      : '(none)';
    lines.push('Toppings:    ' + toppings);

    if (config.writingStyle && config.writingStyle !== 'none') {
      lines.push('Writing:     ' + config.writingStyle
        + (config.writingText ? ' — "' + config.writingText + '"' : ''));
    }
    if (config.theme)           lines.push('Theme:       ' + config.theme);
    if (config.colors)          lines.push('Colors:      ' + config.colors);
    if (config.specialRequests) lines.push('Special:     ' + config.specialRequests);

  } else if (data.order) {
    // Catch-all for non-cake item types
    lines.push('--- Order Details ---');
    if (order.quantity) lines.push('Quantity:    ' + order.quantity);
    if (order.type)     lines.push('Type:        ' + order.type);
  }

  lines.push('');
  lines.push('Log in to Google Sheets to review and update the order status.');

  MailApp.sendEmail(MERCHANT_NOTIFY_EMAIL, subject, lines.join('\n'));
  Logger.log('Merchant notification sent to ' + MERCHANT_NOTIFY_EMAIL);
}

/**
 * Create a JSON response
 */
function createResponse(statusCode, message, data = {}) {
  const response = {
    statusCode: statusCode,
    message: message,
    ...data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify setup (run this manually in Apps Script editor)
 */
function testSetup() {
  const sheet = getOrdersSheet();
  Logger.log('Sheet name: ' + sheet.getName());
  Logger.log('Last row: ' + sheet.getLastRow());
  
  const token = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
  if (token) {
    Logger.log('Token is configured ✓');
  } else {
    Logger.log('⚠️ Token is NOT configured! Add it in Project Settings > Script Properties');
  }
}

/**
 * TEST FUNCTION - Simulates an actual order submission
 * Run this to test without needing to submit from the website
 */
function testOrderSubmission() {
  // Get the real token from properties
  const token = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
  
  if (!token) {
    Logger.log('ERROR: Token not configured!');
    return;
  }
  
  // Simulate a single item order (brownies)
  const testData = {
    token: token,
    itemType: 'brownies',
    order: {
      type: 'brownies',
      quantity: 16
    },
    contact: {
      name: 'Test Customer',
      email: 'test2@example.com',
      phone: '5551234567',
      deliveryMethod: 'pickup',
      targetDate: '2026-02-01',
      notes: 'Test order - single item format'
    }
  };
  
  // Create a fake event object like Google sends
  const fakeEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  Logger.log('=== RUNNING TEST ORDER ===');
  Logger.log('Test data: ' + JSON.stringify(testData, null, 2));
  
  // Call doPost with the fake event
  const result = doPost(fakeEvent);
  
  // Log the result
  const resultText = result.getContent();
  Logger.log('Result: ' + resultText);
}

/**
 * Test the order limit check (run this manually in Apps Script editor)
 * Uses YOUR phone - edit if needed
 */
function testOrderLimitCheck() {
  const sheet = getOrdersSheet();
  
  // YOUR phone number - change if different
  const testPhone = '6787619403';
  
  Logger.log('=== ORDER LIMIT CHECK TEST (PHONE ONLY) ===');
  Logger.log('Phone: ' + testPhone);
  Logger.log('Max allowed: ' + MAX_OPEN_ORDERS_PER_CUSTOMER);
  Logger.log('Closed statuses: ' + JSON.stringify(CLOSED_STATUSES));
  
  const data = sheet.getDataRange().getValues();
  Logger.log('Total rows in sheet: ' + data.length);
  
  const normalizedPhone = testPhone.replace(/\D/g, '');
  Logger.log('Normalized phone: "' + normalizedPhone + '"');
  
  // Check each row
  Logger.log('--- Matching rows ---');
  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][6] || '').replace(/\D/g, '');
    const rowStatus = String(data[i][2] || '').trim();
    
    if (rowPhone === normalizedPhone) {
      const isClosed = CLOSED_STATUSES.includes(rowStatus);
      Logger.log('Row ' + (i+1) + ': phone="' + rowPhone + '" status="' + rowStatus + '" isClosed=' + isClosed);
    }
  }
  
  const openOrders = countOpenOrdersByPhone(sheet, testPhone);
  Logger.log('--- RESULT ---');
  Logger.log('Open orders found: ' + openOrders);
  
  if (openOrders >= MAX_OPEN_ORDERS_PER_CUSTOMER) {
    Logger.log('WOULD BE BLOCKED');
  } else {
    Logger.log('Would be ALLOWED');
  }
}

/**
 * List all orders and their statuses (for debugging)
 */
function listAllOrders() {
  const sheet = getOrdersSheet();
  const data = sheet.getDataRange().getValues();
  
  Logger.log('=== ALL ORDERS ===');
  Logger.log('Total rows: ' + data.length);
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const orderId = data[i][0];
    const status = data[i][2];
    const email = data[i][5];
    const phone = data[i][6];
    const isClosed = CLOSED_STATUSES.includes(String(status).trim());
    
    Logger.log('Row ' + (i+1) + ': ' + orderId + ' | Status: "' + status + '" | Email: ' + email + ' | Phone: ' + phone + ' | Closed: ' + isClosed);
  }
}
