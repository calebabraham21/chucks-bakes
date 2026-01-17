/**
 * API utilities for submitting orders to the backend
 */

import type { RequestItem, CartItem, ContactInfo } from './validation';
import { ITEMS } from './constants';

export interface SubmitOrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  orderIds?: string[];
  errorCode?: string;
  openOrders?: number;
  maxAllowed?: number;
}

/**
 * Combine cart items with contact info to create RequestItems ready for submission
 */
export function prepareOrdersForSubmission(
  cart: CartItem[],
  contact: ContactInfo
): RequestItem[] {
  return cart.map((item) => {
    if (item.itemType === ITEMS.CAKE && 'config' in item) {
      return {
        itemType: item.itemType,
        config: item.config,
        contact,
      };
    } else {
      return {
        itemType: item.itemType,
        order: (item as any).order,
        contact,
      };
    }
  }) as RequestItem[];
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
      // Return structured error for specific error codes
      if (data.errorCode === 'ORDER_LIMIT_REACHED') {
        return {
          success: false,
          message: data.message || 'Order limit reached',
          errorCode: data.errorCode,
          openOrders: data.openOrders,
          maxAllowed: data.maxAllowed,
        };
      }
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
 * Generate order ID in format CB-YYMMDD-XXXX
 */
function generateOrderId(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `CB-${year}${month}${day}-${random}`;
}

/**
 * Submit multiple order requests with the SAME Order ID
 * Order limit is only checked on the first item
 */
export async function submitOrderBatch(orders: (RequestItem & { website?: string })[]): Promise<SubmitOrderResponse> {
  try {
    // Generate ONE order ID for all items
    const orderId = generateOrderId();
    console.log(`[OrderBatch] Starting batch with ${orders.length} items, Order ID: ${orderId}`);
    
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const isFirstItem = i === 0;
      
      console.log(`[OrderBatch] Submitting item ${i + 1}/${orders.length}, skipLimitCheck: ${!isFirstItem}`);
      
      // Add orderId and skipLimitCheck flag to the request
      const orderWithId = {
        ...order,
        orderId: orderId,
        skipLimitCheck: !isFirstItem, // Only check limit on first item
      };
      
      const result = await submitOrder(orderWithId as any);
      
      console.log(`[OrderBatch] Item ${i + 1} result:`, result.success ? 'SUCCESS' : `FAILED - ${result.message}`);
      
      // If any submission fails, stop and report the error
      if (!result.success) {
        console.error(`[OrderBatch] Item ${i + 1} failed, stopping batch`);
        return result;
      }
      
      // Small delay between requests
      if (orders.length > 1 && i < orders.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`[OrderBatch] All ${orders.length} items submitted successfully`);
    return {
      success: true,
      message: `Successfully submitted ${orders.length} item${orders.length > 1 ? 's' : ''}`,
      orderId: orderId,
      orderIds: [orderId],
    };
  } catch (error) {
    console.error('[OrderBatch] Error:', error);
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

