// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    SMTP_HOST: "192.168.11.17",
    SMTP_PORT: "2500",
    SMTP_SECURE: "false",
    SMTP_REQUIRE_TLS: "true",
    SMTP_SecureConnection: "false",
  },
};
