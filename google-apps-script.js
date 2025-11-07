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
    
    // Add the order data
    addOrderRow(sheet, data);
    
    Logger.log('Order added successfully');
    return createResponse(200, 'Order received successfully', { success: true });
    
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
 * Add header row to the sheet
 */
function addHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Name',
    'Email', 
    'Phone',
    'Pickup/Delivery',
    'Target Date',
    'Target Time',
    'Item Type',
    'Details',
    'Quantity',
    'Budget',
    'Notes',
    'Referral Source',
    'Status'
  ];
  
  sheet.appendRow(headers);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#3b1f1e');
  headerRange.setFontColor('#ffffff');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Add an order row to the sheet
 */
function addOrderRow(sheet, data) {
  const timestamp = new Date();
  
  // Extract order details based on item type
  let details = '';
  let quantity = '';
  
  if (data.itemType === 'cake' && data.config) {
    const config = data.config;
    details = `Size: ${config.size || 'N/A'}\n` +
              `Flavor: ${config.flavor || 'N/A'}\n` +
              `Filling: ${config.filling || 'N/A'}\n` +
              `Frosting: ${config.frostingType || 'N/A'}` +
              (config.smbcFlavor ? ` (${config.smbcFlavor})` : '') + '\n' +
              (config.theme ? `Theme: ${config.theme}\n` : '') +
              (config.colors && config.colors.length > 0 ? `Colors: ${config.colors.join(', ')}` : '');
    quantity = '1 cake';
  } else if (data.order) {
    details = `${data.itemType}`;
    quantity = data.order.quantity || 'N/A';
  }
  
  const contact = data.contact || {};
  
  const row = [
    timestamp,
    contact.name || '',
    contact.email || '',
    contact.phone || '',
    data.deliveryMethod || 'Pickup', // Default to pickup if not specified
    contact.targetDate || '',
    data.targetTime || '',
    data.itemType || '',
    details,
    quantity,
    data.budget || '',
    contact.notes || '',
    data.referralSource || '',
    'New' // Status column
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns after adding data
  const lastRow = sheet.getLastRow();
  for (let i = 1; i <= row.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Add alternating row colors
  if (lastRow > 1) {
    const dataRange = sheet.getRange(lastRow, 1, 1, row.length);
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#fde7ee');
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

