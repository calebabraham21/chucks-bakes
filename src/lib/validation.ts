import { z } from 'zod';
import { ITEMS, MAX_COLOR_CHIPS, MAX_THEME_LENGTH, MAX_WRITING_LENGTH, MAX_TOPPINGS } from './constants';

// Cake configuration schema
export const cakeConfigSchema = z.object({
  size: z.string().min(1, 'Please select a size'),
  flavor: z.string().min(1, 'Please select a flavor'),
  filling: z.string().min(1, 'Please select a filling'),
  frostingFlavor: z.string().min(1, 'Please select a frosting flavor'),
  toppings: z.array(z.string()).max(MAX_TOPPINGS).default([]),
  writingStyle: z.string().optional(),
  writingText: z.string().max(MAX_WRITING_LENGTH).optional(),
  theme: z.string().max(MAX_THEME_LENGTH).optional(),
  colors: z.array(z.string()).max(MAX_COLOR_CHIPS).default([]),
  specialRequests: z.string().optional(),
});

export type CakeConfig = z.infer<typeof cakeConfigSchema>;

// Treat order schema (brownies, cookies)
export const treatOrderSchema = z.object({
  type: z.enum([ITEMS.BROWNIES, ITEMS.COOKIES]),
  quantity: z.number().int().positive('Please select a quantity'),
});

export type TreatOrder = z.infer<typeof treatOrderSchema>;

// Contact information schema
export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Please enter a valid phone number (at least 10 digits)')
    .max(15, 'Phone number is too long')
    .regex(/^\d+$/, 'Phone number should only contain digits'),
  deliveryMethod: z.enum(['pickup', 'delivery']).default('pickup'),
  targetDate: z.string().min(1, 'Please select a target date'),
  notes: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Cart item - item WITHOUT contact info (used in cart before checkout)
export const cartItemSchema = z.discriminatedUnion('itemType', [
  z.object({
    itemType: z.literal(ITEMS.CAKE),
    config: cakeConfigSchema,
  }),
  z.object({
    itemType: z.literal(ITEMS.BROWNIES),
    order: treatOrderSchema,
  }),
  z.object({
    itemType: z.literal(ITEMS.COOKIES),
    order: treatOrderSchema,
  }),
]);

export type CartItem = z.infer<typeof cartItemSchema>;

// Order draft - same as CartItem (for building an item before adding to cart)
export const orderDraftSchema = cartItemSchema;

export type OrderDraft = z.infer<typeof orderDraftSchema>;

// Request item (finalized item WITH contact info - for submission)
export const requestItemSchema = z.discriminatedUnion('itemType', [
  z.object({
    itemType: z.literal(ITEMS.CAKE),
    config: cakeConfigSchema,
    contact: contactInfoSchema,
  }),
  z.object({
    itemType: z.literal(ITEMS.BROWNIES),
    order: treatOrderSchema,
    contact: contactInfoSchema,
  }),
  z.object({
    itemType: z.literal(ITEMS.COOKIES),
    order: treatOrderSchema,
    contact: contactInfoSchema,
  }),
]);

export type RequestItem = z.infer<typeof requestItemSchema>;
