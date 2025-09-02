import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Directly redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting - MTM VPN Dashboard</title>
        <meta name="description" content="MTM VPN Admin Dashboard" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </>
  );
}