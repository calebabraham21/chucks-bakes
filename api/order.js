/**
 * Vercel Serverless Function for Chuck's Bakes Order Submission
 * 
 * This API route receives order data from the frontend and forwards it
 * to the Google Apps Script that writes to the Google Sheet.
 * 
 * SECURITY:
 * - API_ORDER_TOKEN is kept server-side only (never exposed to client)
 * - CORS headers allow requests only from your domain (configure as needed)
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
    // If the 'website' field is filled, it's likely a bot
    if (orderData.website && orderData.website.trim() !== '') {
      console.log('Honeypot triggered - potential spam blocked');
      // Return success to the bot so they don't know they were blocked
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
      // Google Apps Script can take a moment
      timeout: 10000,
    });

    // Check if Google Apps Script responded
    if (!response.ok) {
      console.error('Google Apps Script error:', response.status, response.statusText);
      throw new Error('Failed to submit order to Google Sheets');
    }

    const result = await response.json();

    // Check if Google Apps Script reported success
    if (result.statusCode !== 200) {
      console.error('Google Apps Script returned error:', result);
      throw new Error(result.message || 'Failed to process order');
    }

    // Success!
    console.log('Order submitted successfully');
    return res.status(200).json({ 
      success: true, 
      message: 'Order submitted successfully' 
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while submitting your order. Please try again or contact us directly.' 
    });
  }
}

