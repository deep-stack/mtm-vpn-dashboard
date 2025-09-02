import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('isAdminAuthenticated');
      
      if (authToken === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      
      setIsLoading(false);
    };

    // Only check auth on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}