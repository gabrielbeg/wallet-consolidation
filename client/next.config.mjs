/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // Handle PDF renderer
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;

        return config;
    },
    transpilePackages: ["@react-pdf/renderer"],
};
  
  
  export default nextConfig;
  