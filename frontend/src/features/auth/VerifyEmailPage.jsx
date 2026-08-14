import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  
  return (
    <div className="mx-auto mt-20 grid w-full max-w-sm gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && <CardDescription>Verifying your email...</CardDescription>}
          {status === 'missing' && <CardDescription>No verification token provided.</CardDescription>}
          {status === 'success' && (
            <div>
              <CardDescription className="text-green-600">Email verified successfully! You can now log in.</CardDescription>
              <Link to="/login" className="mt-2 inline-block text-sm underline-offset-4 hover:underline">Go to login</Link>
            </div>
          )}
          {status === 'error' && (
            <div>
              <CardDescription className="text-destructive">{errorMsg}</CardDescription>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
