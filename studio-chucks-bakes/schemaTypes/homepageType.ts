import {defineType, defineField} from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  icon: () => '🏠',
  fields: [
    // Hero Section
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline on the homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Text below the main headline',
      rows: 3,
    }),
    defineField({
      name: 'heroButtonText',
      title: 'Hero Button Text',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // Kitchen Intro Section
    defineField({
      name: 'kitchenTitle',
      title: 'Kitchen Section Title',
      type: 'string',
      description: 'e.g., "From Cristina\'s kitchen"',
    }),
    defineField({
      name: 'kitchenDescription',
      title: 'Kitchen Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'kitchenLinkText',
      title: 'Kitchen Link Text',
      type: 'string',
    }),
    defineField({
      name: 'kitchenImage',
      title: 'Kitchen Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // What We Bake Section
    defineField({
      name: 'whatWeBakeTitle',
      title: 'What We Bake - Title',
      type: 'string',
    }),
    defineField({
      name: 'whatWeBakeSubtitle',
      title: 'What We Bake - Subtitle',
      type: 'text',
      rows: 2,
    }),

    // How It Works Section
    defineField({
      name: 'howItWorksTitle',
      title: 'How It Works - Title',
      type: 'string',
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'How It Works - Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Step Title'},
            {name: 'description', type: 'text', title: 'Step Description', rows: 2},
          ],
        },
      ],
    }),

    // Footer CTA Section
    defineField({
      name: 'footerCtaTitle',
      title: 'Footer CTA Title',
      type: 'string',
    }),
    defineField({
      name: 'footerCtaDescription',
      title: 'Footer CTA Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'footerCtaButtonText',
      title: 'Footer CTA Button Text',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Content',
        subtitle: 'Edit all homepage sections',
      }
    },
  },
})

