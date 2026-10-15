// vite-imagetools query imports (https://github.com/JonasKruckenberg/imagetools)
declare module '*&as=srcset' {
  const srcset: string;
  export default srcset;
}

declare module '*&format=webp' {
  const src: string;
  export default src;
}
