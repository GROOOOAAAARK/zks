import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                ],
            },
        ];
    },
    experimental: {
        serverComponentsExternalPackages: ['@aztec/bb.js'],
        turbo: {
            resolveAlias: {
                'worker_threads': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'fs': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'path': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'os': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'crypto': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'stream': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'http': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'https': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'zlib': path.resolve(__dirname, 'src/turbopack-shims.js'),
                'constants': path.resolve(__dirname, 'src/turbopack-shims.js'),
            },
        },
    },
};

export default nextConfig;
