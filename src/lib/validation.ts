import { z } from 'zod';
import { ITEMS, TREAT_MINIMUMS, MAX_COLOR_CHIPS, MAX_THEME_LENGTH, MAX_CUPCAKE_FLAVORS, MAX_CUPCAKE_FILLINGS } from './constants';

// Cake configuration schema
export const cakeConfigSchema = z.object({
  size: z.string().min(1, 'Please select a size'),
  flavor: z.string().min(1, 'Please select a flavor'),
  filling: z.string().min(1, 'Please select a filling'),
  frostingType: z.enum(['smbc', 'american'], { 
    required_error: 'Please select a frosting type' 
  }),
  smbcFlavor: z.string().optional(),
  theme: z.string().max(MAX_THEME_LENGTH).optional(),
  colors: z.array(z.string()).max(MAX_COLOR_CHIPS).default([]),
}).refine(
  (data: { frostingType: string; smbcFlavor?: string }) => {
    // If SMBC is selected, smbcFlavor is required
    if (data.frostingType === 'smbc') {
      return data.smbcFlavor && data.smbcFlavor.length > 0;
    }
    return true;
  },
  {
    message: 'Please select an SMBC flavor',
    path: ['smbcFlavor'],
  }
);

export type CakeConfig = z.infer<typeof cakeConfigSchema>;

// Cupcake configuration schema
export const cupcakeConfigSchema = z.object({
  quantity: z.number().int().positive('Please select a quantity'),
  flavors: z.array(z.string()).min(1, 'Please select at least one flavor').max(MAX_CUPCAKE_FLAVORS, `You can select up to ${MAX_CUPCAKE_FLAVORS} flavors`),
  fillings: z.array(z.string()).max(MAX_CUPCAKE_FILLINGS, `You can select up to ${MAX_CUPCAKE_FILLINGS} fillings`).default([]),
  smbcFlavor: z.string().min(1, 'Please select a buttercream flavor'),
  theme: z.string().max(MAX_THEME_LENGTH).optional(),
  colors: z.array(z.string()).max(MAX_COLOR_CHIPS).default([]),
});

export type CupcakeConfig = z.infer<typeof cupcakeConfigSchema>;

// Treat order schema (brownies, cookies, seasonal)
export const treatOrderSchema = z.object({
  type: z.enum([ITEMS.BROWNIES, ITEMS.COOKIES, ITEMS.SEASONAL]),
  quantity: z.number().int().positive('Please select a quantity'),
});

export type TreatOrder = z.infer<typeof treatOrderSchema>;

// Contact information schema
export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  deliveryMethod: z.enum(['pickup', 'delivery']).default('pickup'),
  targetDate: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
  referralSource: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Order draft - discriminated union
export const orderDraftSchema = z.discriminatedUnion('itemType', [
  z.object({
    itemType: z.literal(ITEMS.CAKE),
    config: cakeConfigSchema,
    contact: contactInfoSchema.optional(),
  }),
  z.object({
    itemType: z.literal(ITEMS.CUPCAKES),
    config: cupcakeConfigSchema,
    contact: contactInfoSchema.optional(),
  }),
  z.object({
    itemType: z.literal(ITEMS.BROWNIES),
    order: treatOrderSchema,
    contact: contactInfoSchema.optional(),
  }),
  z.object({
    itemType: z.literal(ITEMS.COOKIES),
    order: treatOrderSchema,
    contact: contactInfoSchema.optional(),
  }),
  z.object({
    itemType: z.literal(ITEMS.SEASONAL),
    order: treatOrderSchema,
    contact: contactInfoSchema.optional(),
  }),
]);

export type OrderDraft = z.infer<typeof orderDraftSchema>;

// Request item (finalized item with contact info)
export const requestItemSchema = z.discriminatedUnion('itemType', [
  z.object({
    itemType: z.literal(ITEMS.CAKE),
    config: cakeConfigSchema,
    contact: contactInfoSchema,
  }),
  z.object({
    itemType: z.literal(ITEMS.CUPCAKES),
    config: cupcakeConfigSchema,
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
  z.object({
    itemType: z.literal(ITEMS.SEASONAL),
    order: treatOrderSchema,
    contact: contactInfoSchema,
  }),
]);

export type RequestItem = z.infer<typeof requestItemSchema>;

