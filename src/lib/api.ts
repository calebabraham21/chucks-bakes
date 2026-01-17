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
 * Submit all cart items as a single order batch
 * All items get the same order ID
 */
export async function submitOrderBatch(orders: (RequestItem & { website?: string })[]): Promise<SubmitOrderResponse> {
  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: orders,
        contact: orders[0]?.contact, // Contact info is the same for all items
        website: orders[0]?.website || '', // Honeypot field
      }),
    });

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
      orderIds: [data.orderId],
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

