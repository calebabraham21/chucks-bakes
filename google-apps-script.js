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

// Maximum open orders per phone number
const MAX_OPEN_ORDERS_PER_CUSTOMER = 2;

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
  
  // Normalize the phone number (remove non-digits for comparison)
  const normalizedPhone = phone.replace(/\D/g, '');
  
  // Get all data (skip header row)
  const data = sheet.getDataRange().getValues();
  let openCount = 0;
  
  // Column indices (0-based)
  const STATUS_COL = 2;  // Column C - Status
  const PHONE_COL = 6;   // Column G - Phone
  
  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][PHONE_COL] || '').replace(/\D/g, '');
    const rowStatus = String(data[i][STATUS_COL] || '').trim();
    
    // Check if phone matches and status is open
    if (rowPhone === normalizedPhone && !CLOSED_STATUSES.includes(rowStatus)) {
      openCount++;
    }
  }
  
  return openCount;
}

/**
 * Handle POST requests from the order form
 */
function doPost(e) {
  try {
    // Parse the request
    const data = JSON.parse(e.postData.contents);
    
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
    
    // Check for open order limit by phone number
    const phone = data.contact?.phone;
    if (phone) {
      const openOrders = countOpenOrdersByPhone(sheet, phone);
      if (openOrders >= MAX_OPEN_ORDERS_PER_CUSTOMER) {
        Logger.log('Order limit reached for phone: ' + phone + ' (has ' + openOrders + ' open orders)');
        return createResponse(429, 'You already have ' + openOrders + ' pending orders. Please wait for your current orders to be completed before placing new ones.', { 
          success: false, 
          errorCode: 'ORDER_LIMIT_REACHED',
          openOrders: openOrders,
          maxAllowed: MAX_OPEN_ORDERS_PER_CUSTOMER
        });
      }
    }
    
    // Generate order ID
    const orderId = generateOrderId();
    
    // Add the order data
    addOrderRow(sheet, data, orderId);
    
    Logger.log('Order added successfully with ID: ' + orderId);
    return createResponse(200, 'Order received successfully', { success: true, orderId: orderId });
    
  } catch (error) {
    Logger.log('Error processing order: ' + error.toString());
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
    row.quantity = data.order.quantity || '';
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
