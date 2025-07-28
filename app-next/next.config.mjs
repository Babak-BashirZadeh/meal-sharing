/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
