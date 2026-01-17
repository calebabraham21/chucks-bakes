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

// Maximum open orders per customer (checked by email OR phone)
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
 * Count open orders for a given customer (by email OR phone)
 * Returns the number of orders where status is NOT in CLOSED_STATUSES
 */
function countOpenOrdersByCustomer(sheet, email, phone) {
  if (sheet.getLastRow() <= 1) {
    return 0;
  }
  
  // Normalize inputs for comparison
  const normalizedPhone = phone ? phone.replace(/\D/g, '') : '';
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  
  // Need at least one identifier
  if (!normalizedPhone && !normalizedEmail) {
    return 0;
  }
  
  // Get all data (skip header row)
  const data = sheet.getDataRange().getValues();
  let openCount = 0;
  
  // Column indices (0-based)
  const STATUS_COL = 2;  // Column C - Status
  const EMAIL_COL = 5;   // Column F - Email
  const PHONE_COL = 6;   // Column G - Phone
  
  for (let i = 1; i < data.length; i++) {
    const rowEmail = String(data[i][EMAIL_COL] || '').toLowerCase().trim();
    const rowPhone = String(data[i][PHONE_COL] || '').replace(/\D/g, '');
    const rowStatus = String(data[i][STATUS_COL] || '').trim();
    
    // Check if email OR phone matches and status is open
    const emailMatches = normalizedEmail && rowEmail === normalizedEmail;
    const phoneMatches = normalizedPhone && rowPhone === normalizedPhone;
    
    if ((emailMatches || phoneMatches) && !CLOSED_STATUSES.includes(rowStatus)) {
      openCount++;
    }
  }
  
  return openCount;
}

/**
 * Handle POST requests from the order form
 * Accepts batch orders: { items: [...], contact: {...} }
 * All items in a batch share the same Order ID
 */
function doPost(e) {
  try {
    // Parse the request
    const data = JSON.parse(e.postData.contents);
    
    // Log incoming data for debugging
    Logger.log('=== INCOMING ORDER REQUEST ===');
    Logger.log('Raw data keys: ' + Object.keys(data).join(', '));
    
    // Verify the token
    const providedToken = data.token;
    const expectedToken = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
    
    if (!expectedToken) {
      return createResponse(500, 'Server configuration error: Token not set');
    }
    
    if (providedToken !== expectedToken) {
      Logger.log('Authentication failed - invalid token');
      return createResponse(401, 'Unauthorized');
    }
    
    // Get the Orders sheet
    const sheet = getOrdersSheet();
    
    // Check if this is the first row (needs headers)
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet);
    }
    
    // Extract contact and items from batch format
    const contact = data.contact;
    const items = data.items || [];
    
    Logger.log('Contact: ' + JSON.stringify(contact));
    Logger.log('Number of items: ' + items.length);
    if (items.length > 0) {
      Logger.log('First item: ' + JSON.stringify(items[0]));
    }
    
    if (!contact || !contact.email) {
      Logger.log('ERROR: Missing contact information');
      return createResponse(400, 'Missing contact information');
    }
    
    if (items.length === 0) {
      Logger.log('ERROR: No items in order');
      return createResponse(400, 'No items in order');
    }
    
    // Check for open order limit by email or phone number
    const email = contact.email;
    const phone = contact.phone;
    
    Logger.log('Checking order limit for email: ' + email + ', phone: ' + phone);
    const openOrders = countOpenOrdersByCustomer(sheet, email, phone);
    Logger.log('Found ' + openOrders + ' open orders for this customer');
    
    if (openOrders >= MAX_OPEN_ORDERS_PER_CUSTOMER) {
      Logger.log('ORDER BLOCKED: Limit reached for customer (email: ' + email + ', phone: ' + phone + ')');
      return createResponse(429, 'You already have a pending order! Please wait for it to be completed before placing a new one.', { 
        success: false, 
        errorCode: 'ORDER_LIMIT_REACHED',
        openOrders: openOrders,
        maxAllowed: MAX_OPEN_ORDERS_PER_CUSTOMER
      });
    }
    
    // Generate ONE order ID for ALL items in this batch
    const orderId = generateOrderId();
    Logger.log('Generated Order ID: ' + orderId);
    
    // Add each item as a row, all with the same Order ID
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      Logger.log('Processing item ' + (i+1) + ': ' + JSON.stringify(item));
      
      const itemData = {
        itemType: item.itemType,
        config: item.config,
        order: item.order,
        contact: contact
      };
      
      // Add item number suffix if multiple items (e.g., CB-260117-1234-A, CB-260117-1234-B)
      const itemOrderId = items.length > 1 
        ? orderId + '-' + String.fromCharCode(65 + i)  // A, B, C...
        : orderId;
      
      Logger.log('Adding row with Order ID: ' + itemOrderId);
      addOrderRow(sheet, itemData, itemOrderId);
    }
    
    Logger.log('=== ORDER SUCCESS: ' + orderId + ' (' + items.length + ' item(s)) ===');
    return createResponse(200, 'Order received successfully', { success: true, orderId: orderId });
    
  } catch (error) {
    Logger.log('=== ORDER ERROR: ' + error.toString() + ' ===');
    return createResponse(500, 'Error processing order: ' + error.message);
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
  
  Logger.log('addOrderRow called with itemType: ' + data.itemType);
  Logger.log('Has config: ' + (data.config ? 'YES' : 'NO'));
  Logger.log('Has order: ' + (data.order ? 'YES' : 'NO'));
  
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
    Logger.log('Processing as CAKE');
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
    Logger.log('Processing as TREAT (brownies/cookies)');
    Logger.log('Order data: ' + JSON.stringify(data.order));
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
  } else {
    Logger.log('WARNING: Item has no config or order data!');
  }
  
  Logger.log('Row itemType: ' + row.itemType + ', quantity: ' + row.quantity);
  
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
  
  // Simulate a batch order with 2 items (brownies)
  const testData = {
    token: token,
    contact: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '1234567890',
      deliveryMethod: 'pickup',
      targetDate: '2026-02-01',
      notes: 'Test order'
    },
    items: [
      {
        itemType: 'brownies',
        order: {
          type: 'brownies',
          quantity: 16
        }
      }
    ]
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
 * Replace with an actual email/phone from your sheet to test
 */
function testOrderLimitCheck() {
  const sheet = getOrdersSheet();
  
  // Change these to test with real values from your sheet
  const testEmail = 'test@example.com';
  const testPhone = '1234567890';
  
  Logger.log('Testing order limit check...');
  Logger.log('Email: ' + testEmail);
  Logger.log('Phone: ' + testPhone);
  Logger.log('Max allowed: ' + MAX_OPEN_ORDERS_PER_CUSTOMER);
  Logger.log('Closed statuses: ' + CLOSED_STATUSES.join(', '));
  
  const openOrders = countOpenOrdersByCustomer(sheet, testEmail, testPhone);
  Logger.log('Open orders found: ' + openOrders);
  
  if (openOrders >= MAX_OPEN_ORDERS_PER_CUSTOMER) {
    Logger.log('Result: WOULD BE BLOCKED');
  } else {
    Logger.log('Result: Would be allowed');
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
