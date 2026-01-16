/**
 * API utilities for submitting orders to the backend
 */

import type { RequestItem } from './validation';

export interface SubmitOrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  orderIds?: string[];
}

/**
 * Submit a single order request to the API
 */
export async function submitOrder(orderData: RequestItem & { website?: string }): Promise<SubmitOrderResponse> {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    // Check if response has content
    const text = await response.text();
    
    if (!text) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse response:', text);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit order');
    }

    return {
      success: true,
      message: data.message || 'Order submitted successfully',
      orderId: data.orderId,
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Submit multiple order requests as a batch
 * Returns all order IDs for email confirmation
 */
export async function submitOrderBatch(orders: RequestItem[]): Promise<SubmitOrderResponse> {
  try {
    // Submit each order sequentially to avoid overwhelming the API
    const results: SubmitOrderResponse[] = [];
    const orderIds: string[] = [];
    
    for (const order of orders) {
      const result = await submitOrder(order);
      results.push(result);
      
      // Collect all order IDs
      if (result.orderId) {
        orderIds.push(result.orderId);
      }
      
      // If any submission fails, stop and report the error
      if (!result.success) {
        return result;
      }
      
      // Small delay between requests to be nice to Google Sheets API
      if (orders.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return {
      success: true,
      message: `Successfully submitted ${orders.length} order${orders.length > 1 ? 's' : ''}`,
      orderId: orderIds[orderIds.length - 1], // Keep last ID for backward compatibility
      orderIds, // All IDs for email confirmation
    };
  } catch (error) {
    console.error('Error submitting order batch:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Send order confirmation email
 * This is called after successful order submission
 * 
 * NOTE: This endpoint calls a server-side function that uses the Resend API.
 * The API key is stored server-side only (without VITE_ prefix) to prevent
 * exposure to the client browser.
 */
export async function sendConfirmationEmail(
  orders: RequestItem[],
  orderIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orders, orderIds }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Email confirmation failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to send confirmation email',
      };
    }

    return {
      success: true,
      message: 'Confirmation email sent',
    };
  } catch (error) {
    // Log but don't throw - email failure shouldn't block the order success flow
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send confirmation email',
    };
  }
}

