/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/friend',
                destination: 'friend/online',
                permanent: true
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: ''
            }
        ]
    }
};

export default nextConfig;
