/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: an unrelated package-lock.json in $HOME otherwise
  // makes Turbopack infer a root outside this repository.
  turbopack: { root: import.meta.dirname },
  images: {
    // Derivatives are published to Vercel Blob by tools/ingest and referenced
    // from content/assets/*.json by absolute URL.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
