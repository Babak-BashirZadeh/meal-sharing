/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://meal-sharing-119o.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
