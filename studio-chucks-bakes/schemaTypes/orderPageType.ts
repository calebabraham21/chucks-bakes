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

    // Product Items
    defineField({
      name: 'cakeLabel',
      title: 'Cake - Label',
      type: 'string',
    }),
    defineField({
      name: 'cakeDescription',
      title: 'Cake - Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'cupcakesLabel',
      title: 'Cupcakes - Label',
      type: 'string',
    }),
    defineField({
      name: 'cupcakesDescription',
      title: 'Cupcakes - Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'browniesLabel',
      title: 'Brownies - Label',
      type: 'string',
    }),
    defineField({
      name: 'browniesDescription',
      title: 'Brownies - Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'cookiesLabel',
      title: 'Cookies - Label',
      type: 'string',
    }),
    defineField({
      name: 'cookiesDescription',
      title: 'Cookies - Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'seasonalLabel',
      title: 'Seasonal Item - Label',
      type: 'string',
    }),
    defineField({
      name: 'seasonalDescription',
      title: 'Seasonal Item - Description',
      type: 'text',
      rows: 2,
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

