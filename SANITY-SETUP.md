# Sanity CMS Setup Guide

This project uses Sanity CMS for managing blog content (recipes, stories, etc.).

## Project Structure

- **Main App** (`src/`): React frontend that displays content
- **Sanity Studio** (`studio-chucks-bakes/`): Content management interface

## Quick Start

### 1. Set Up Environment Variables

Copy the environment variables to your `.env` file:

```bash
VITE_SANITY_PROJECT_ID=gxunh0um
VITE_SANITY_DATASET=production
```

These are already configured in your `env.template`.

### 2. Start Sanity Studio (Content Management)

```bash
cd studio-chucks-bakes
npm run dev
```

The Studio will be available at `http://localhost:3333`

### 3. Start Main App

In a separate terminal:

```bash
cd ..
npm run dev
```

The app will be available at `http://localhost:5173`

## Creating Content

1. Open Sanity Studio at `http://localhost:3333`
2. Click "Post" to create a new post
3. Fill in:
   - **Title**: The recipe or blog post title
   - **Slug**: Auto-generates from title (used in URLs)
   - **Published At**: Publication date
   - **Image**: Upload a featured image (optional)
   - **Body**: Rich text content with formatting
4. Click "Publish" to make it live

Posts will automatically appear on the Recipes page in the main app!

## How It Works

The main app fetches posts from Sanity using the `@sanity/client` package:

```typescript
// src/lib/sanity.ts
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'gxunh0um',
  dataset: 'production',
  useCdn: true,
});
```

The Recipes page queries all posts:

```typescript
const posts = await sanityClient.fetch(
  '*[_type == "post"] | order(publishedAt desc)'
);
```

## Deployment

### Deploy Sanity Studio

```bash
cd studio-chucks-bakes
npm run deploy
```

This will deploy your Studio to `chucks-bakes.sanity.studio` (or your configured URL).

### Deploy Main App

The main app can be deployed to Vercel, Netlify, or any static hosting:

```bash
npm run build
```

Make sure to set the environment variables in your hosting platform's settings!

## Content Schema

The current schema includes:

### Post Type
- `title` (string, required)
- `slug` (slug, required)
- `publishedAt` (datetime, required)
- `image` (image, optional)
- `body` (rich text, optional)

To add more content types, edit `studio-chucks-bakes/schemaTypes/` and add them to `index.ts`.

## Sanity Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Manage Project](https://www.sanity.io/manage/personal/project/gxunh0um)

## Troubleshooting

### "Failed to load recipes"
- Check that Sanity Studio is running
- Verify environment variables are set correctly
- Check browser console for detailed error messages

### Images not loading
- Make sure images are uploaded in Sanity Studio
- Verify the `@sanity/image-url` package is installed
- Check that `projectId` matches your Sanity project

### Content not updating
- Sanity uses CDN caching. Changes may take a few seconds to appear
- Try setting `useCdn: false` in development for instant updates
- Clear browser cache if needed

