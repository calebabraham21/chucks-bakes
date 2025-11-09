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
 * Add header row to the sheet with granular columns
 */
function addHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Status',
    'Item Type',
    // Contact Info
    'Name',
    'Email', 
    'Phone',
    'Delivery Method',
    'Target Date',
    'Budget',
    'Notes',
    'Referral Source',
    // Cake/Cupcake Config
    'Size',
    'Quantity',
    'Flavor(s)',
    'Filling(s)',
    'Frosting Type',
    'SMBC Flavor',
    'Theme',
    'Colors'
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
function addOrderRow(sheet, data) {
  const timestamp = new Date();
  const contact = data.contact || {};
  
  // Initialize all columns with empty values
  let row = {
    timestamp: timestamp,
    status: 'New',
    itemType: data.itemType || '',
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    deliveryMethod: contact.deliveryMethod || 'pickup',
    targetDate: contact.targetDate || '',
    budget: contact.budget || '',
    notes: contact.notes || '',
    referralSource: contact.referralSource || '',
    size: '',
    quantity: '',
    flavors: '',
    fillings: '',
    frostingType: '',
    smbcFlavor: '',
    theme: '',
    colors: ''
  };
  
  // Fill in item-specific details
  if (data.itemType === 'cake' && data.config) {
    const config = data.config;
    row.size = config.size || '';
    row.quantity = '1 cake';
    row.flavors = config.flavor || '';
    row.fillings = config.filling || '';
    row.frostingType = config.frostingType || '';
    row.smbcFlavor = config.smbcFlavor || '';
    row.theme = config.theme || '';
    row.colors = (config.colors && config.colors.length > 0) ? config.colors.join(', ') : '';
    
  } else if (data.itemType === 'cupcakes' && data.config) {
    const config = data.config;
    row.size = 'N/A';
    row.quantity = config.quantity || '';
    row.flavors = (config.flavors && config.flavors.length > 0) ? config.flavors.join(', ') : '';
    row.fillings = (config.fillings && config.fillings.length > 0) ? config.fillings.join(', ') : '';
    row.frostingType = 'SMBC';
    row.smbcFlavor = config.smbcFlavor || '';
    row.theme = config.theme || '';
    row.colors = (config.colors && config.colors.length > 0) ? config.colors.join(', ') : '';
    
  } else if (data.order) {
    // Brownies, cookies, scones
    row.size = 'N/A';
    row.quantity = data.order.quantity || '';
    row.flavors = 'N/A';
    row.fillings = 'N/A';
    row.frostingType = 'N/A';
    row.smbcFlavor = 'N/A';
    row.theme = 'N/A';
    row.colors = 'N/A';
  }
  
  // Convert row object to array in the correct column order
  const rowArray = [
    row.timestamp,
    row.status,
    row.itemType,
    row.name,
    row.email,
    row.phone,
    row.deliveryMethod,
    row.targetDate,
    row.budget,
    row.notes,
    row.referralSource,
    row.size,
    row.quantity,
    row.flavors,
    row.fillings,
    row.frostingType,
    row.smbcFlavor,
    row.theme,
    row.colors
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
