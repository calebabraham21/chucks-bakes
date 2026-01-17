/**
 * Vercel Serverless Function for Chuck's Bakes Order Submission
 * 
 * This API route receives order data from the frontend and forwards it
 * to the Google Apps Script that writes to the Google Sheet.
 * 
 * SECURITY:
 * - API_ORDER_TOKEN is kept server-side only (never exposed to client)
 * - Honeypot field validation prevents basic spam
 * - Request validation ensures required fields are present
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Get configuration from environment variables
    const GOOGLE_SCRIPT_URL = process.env.VITE_GOOGLE_SCRIPT_URL;
    const API_TOKEN = process.env.API_ORDER_TOKEN;

    // Validate environment variables
    if (!GOOGLE_SCRIPT_URL) {
      console.error('VITE_GOOGLE_SCRIPT_URL not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }

    if (!API_TOKEN) {
      console.error('API_ORDER_TOKEN not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }

    const orderData = req.body;

    // Basic validation - check required fields
    if (!orderData.contact || !orderData.contact.name || !orderData.contact.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required contact information' 
      });
    }

    // HONEYPOT SPAM PROTECTION
    if (orderData.website && orderData.website.trim() !== '') {
      console.log('Honeypot triggered - potential spam blocked');
      return res.status(200).json({ 
        success: true, 
        message: 'Order received' 
      });
    }

    // Remove honeypot field before sending to Google Sheets
    delete orderData.website;

    // Add the API token to the request
    const dataToSend = {
      ...orderData,
      token: API_TOKEN
    };

    // Forward the request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
      redirect: 'follow',
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Google Apps Script error:', response.status, responseText);
      throw new Error('Failed to submit order to Google Sheets');
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid response from Google Sheets');
    }

    if (result.statusCode !== 200) {
      console.error('Google Apps Script error:', result);
      
      if (result.errorCode === 'ORDER_LIMIT_REACHED') {
        return res.status(429).json({
          success: false,
          message: result.message,
          errorCode: 'ORDER_LIMIT_REACHED',
          openOrders: result.openOrders,
          maxAllowed: result.maxAllowed
        });
      }
      
      throw new Error(result.message || 'Failed to process order');
    }

    console.log('Order submitted with ID:', result.orderId);
    return res.status(200).json({ 
      success: true, 
      message: 'Order submitted successfully',
      orderId: result.orderId
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while submitting your order. Please try again or contact us directly.' 
    });
  }
}

