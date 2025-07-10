/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"www.yonex.com"
            },
            {
                protocol:"https",
                hostname:"i.pinimg.com"
            },
            {
                protocol:"https",
                hostname:"static.wixstatic.com"
            },
        ],
    },
};

export default nextConfig;
