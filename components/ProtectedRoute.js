import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../utils/api';

export default function ProtectedRoute({ children, requireCoach = false }) {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (requireCoach && user.role !== 'coach') {
      router.push('/');
    }
  }, [router, requireCoach]);

  return <>{children}</>;
}
