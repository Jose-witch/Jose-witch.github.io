/// <reference types="vite/client" />

/** Filename → URL index of every uploaded photo, built by the `site-media` plugin. */
declare module 'virtual:media-index' {
  const index: Record<string, string>
  export default index
}
