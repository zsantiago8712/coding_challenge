import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    transpilePackages: ['lightningcss'],
};

export default nextConfig;
