import {defineType, defineField} from 'sanity'

export const orderPageType = defineType({
  name: 'orderPage',
  title: 'Order Page Settings',
  type: 'document',
  icon: () => '📝',
  fields: [
    // Step 1: Choose Item Section
    defineField({
      name: 'chooseItemTitle',
      title: 'Step 1 - Title',
      type: 'string',
      description: 'Main heading for the item selection step',
    }),
    defineField({
      name: 'chooseItemSubtitle',
      title: 'Step 1 - Subtitle',
      type: 'string',
      description: 'Text below the heading',
    }),

    // Product Items Array
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      description: 'Add or remove items that customers can order. Drag to reorder.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'itemType',
              title: 'Item Type',
              type: 'string',
              description: '⚠️ MUST be exactly: "cake", "cupcakes", "brownies", "cookies", or "seasonal" (all lowercase)',
              validation: (Rule) => Rule.required().custom((value) => {
                const validTypes = ['cake', 'cupcakes', 'brownies', 'cookies', 'seasonal'];
                if (value && !validTypes.includes(value)) {
                  return `Must be one of: ${validTypes.join(', ')}`;
                }
                return true;
              }),
              options: {
                list: [
                  {title: 'Cake (full configuration form)', value: 'cake'},
                  {title: 'Cupcakes (full configuration form)', value: 'cupcakes'},
                  {title: 'Brownies (simple quantity form)', value: 'brownies'},
                  {title: 'Cookies (simple quantity form)', value: 'cookies'},
                  {title: 'Seasonal (simple quantity form)', value: 'seasonal'},
                ]
              }
            },
            {
              name: 'label',
              title: 'Display Name',
              type: 'string',
              description: 'Name shown to customers',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Short description of the item',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              description: 'Image to display for this item',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              description: 'Uncheck to temporarily hide this item from customers',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'itemType',
              media: 'image',
              enabled: 'enabled',
            },
            prepare({title, subtitle, media, enabled}) {
              return {
                title: enabled ? title : `${title} (Disabled)`,
                subtitle: subtitle,
                media: media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).warning('Add at least one item for customers to order'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Order Page Settings',
        subtitle: 'Edit item labels and descriptions',
      }
    },
  },
})

