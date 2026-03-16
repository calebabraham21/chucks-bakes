import { z } from 'zod';
import { ITEMS, MAX_THEME_LENGTH, MAX_WRITING_LENGTH, MAX_TOPPINGS } from './constants';

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
  colors: z.string().optional().default(''),
  specialRequests: z.string().optional(),
});

export type CakeConfig = z.infer<typeof cakeConfigSchema>;

// Contact information schema
export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Please enter a valid phone number (at least 10 digits)')
    .max(15, 'Phone number is too long')
    .regex(/^\d+$/, 'Phone number should only contain digits'),
  deliveryMethod: z.literal('pickup').default('pickup'),
  targetDate: z.string().min(1, 'Please select a target date'),
  notes: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Cart item — cakes only
export const cartItemSchema = z.object({
  itemType: z.literal(ITEMS.CAKE),
  config: cakeConfigSchema,
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Order draft — same as CartItem
export const orderDraftSchema = cartItemSchema;

export type OrderDraft = z.infer<typeof orderDraftSchema>;

// Request item (finalized item WITH contact info — for submission)
export const requestItemSchema = z.object({
  itemType: z.literal(ITEMS.CAKE),
  config: cakeConfigSchema,
  contact: contactInfoSchema,
});

export type RequestItem = z.infer<typeof requestItemSchema>;
