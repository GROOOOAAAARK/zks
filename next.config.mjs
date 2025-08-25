/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };

        // Enable WebAssembly experiments
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            syncWebAssembly: true,
        };

        // Handle .nr files
        config.module.rules.push({
            test: /\.nr$/,
            type: 'asset/resource',
        });
        // Handle .toml files
        config.module.rules.push({
            test: /\.toml$/,
            type: 'asset/resource',
        });
        // Handle .json files for circuit artifacts
        config.module.rules.push({
            test: /\.json$/,
            type: 'json',
        });

        // Exclude WebAssembly-heavy packages from server-side bundling
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push('@aztec/bb.js', '@noir-lang/noir_js');
        }

    return config;
    },
};

export default nextConfig;