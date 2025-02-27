/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
            pathname: '/**'
        },
        {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**'
        },
        {
            protocol: 'https',
            hostname: 'i.postimg.cc',
            port: '',
            pathname: '/**'
        }]
    }
};

module.exports = nextConfig;
