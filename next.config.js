/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA({
  env: {
    NEXT_PUBLIC_MTM_SERVICE_URL: process.env.NEXT_PUBLIC_MTM_SERVICE_URL,
    NEXT_PUBLIC_NYX_RPC_URL: process.env.NEXT_PUBLIC_NYX_RPC_URL,
  },
})
