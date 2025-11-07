/**
 * API utilities for submitting orders to the backend
 */

import type { RequestItem } from './validation';

export interface SubmitOrderResponse {
  success: boolean;
  message: string;
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit order');
    }

    return {
      success: true,
      message: data.message || 'Order submitted successfully',
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
 */
export async function submitOrderBatch(orders: RequestItem[]): Promise<SubmitOrderResponse> {
  try {
    // Submit each order sequentially to avoid overwhelming the API
    const results = [];
    
    for (const order of orders) {
      const result = await submitOrder(order);
      results.push(result);
      
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
    };
  } catch (error) {
    console.error('Error submitting order batch:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

