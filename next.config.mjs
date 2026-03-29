/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ['better-sqlite3', 'bcryptjs', 'jsonwebtoken'],
};

export default nextConfig;
