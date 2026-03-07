import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const DebugAuth = () => {
  const auth = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Auth Debug Information</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>isAuthenticated:</strong> {JSON.stringify(auth.isAuthenticated)}</p>
              <p><strong>isLoading:</strong> {JSON.stringify(auth.isLoading)}</p>
              <p><strong>isStaff:</strong> {JSON.stringify(auth.isStaff)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Object</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(auth.user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Check if <code className="bg-gray-100 px-2 py-1 rounded">user.is_staff</code> is <code className="bg-gray-100 px-2 py-1 rounded">true</code></p>
            <p>2. If it's <code className="bg-gray-100 px-2 py-1 rounded">false</code> or missing, you need to set it in the database</p>
            <p>3. Go to Django admin or run: <code className="bg-gray-100 px-2 py-1 rounded">python manage.py shell</code></p>
            <p>4. Then run:</p>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto">
{`from apps.authentication.models import User
user = User.objects.get(phone_number='YOUR_PHONE_NUMBER')
user.is_staff = True
user.save()
print(f"User {user.phone_number} is now staff: {user.is_staff}")`}
            </pre>
            <p className="mt-4">5. After setting is_staff=True, logout and login again</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugAuth;
