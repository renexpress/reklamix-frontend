/**
 * Forgot Password Page
 */

import { ForgotPasswordFlow } from '@/components/auth/ForgotPasswordFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Восстановление пароля
          </CardTitle>
          <CardDescription className="text-center">
            Мы отправим код подтверждения на ваш телефон
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordFlow />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
