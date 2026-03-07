/**
 * Register Form Component
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type RegisterFormData = {
  phone_number: string;
  password: string;
  confirm_password: string;
};

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = z
    .object({
      phone_number: z
        .string()
        .regex(/^\+\d{7,15}$/, t('auth.phoneNumberError')),
      password: z
        .string()
        .min(8, t('auth.passwordMinLength'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t('auth.passwordRequirements')
        ),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('auth.passwordsDoNotMatch'),
      path: ['confirm_password'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister({
    onSuccess: (response) => {
      const { tokens } = response.data;
      login(tokens.access, tokens.refresh);

      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.registerSuccessDesc'),
      });

      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: t('auth.registerError'),
        description: getErrorMessage(error),
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setIsLoading(true);
    const { confirm_password, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone_number">{t('auth.phoneNumber')}</Label>
        <Input
          id="phone_number"
          type="tel"
          placeholder={t('auth.phoneNumberPlaceholder')}
          {...register('phone_number')}
          disabled={isLoading}
        />
        {errors.phone_number && (
          <p className="text-sm text-destructive">{errors.phone_number.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t('auth.passwordMinLength')}
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">{t('auth.confirmPassword')}</Label>
        <Input
          id="confirm_password"
          type="password"
          placeholder={t('auth.confirmPasswordPlaceholder')}
          {...register('confirm_password')}
          disabled={isLoading}
        />
        {errors.confirm_password && (
          <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('auth.registerButton')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="text-primary hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </form>
  );
};
