/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure Next.js to serve static files from the public directory
    // This allows index.html to be served as the homepage
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/index.html',
        },
      ];
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;
  