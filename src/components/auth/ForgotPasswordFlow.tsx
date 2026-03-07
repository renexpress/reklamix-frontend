/**
 * Forgot Password Flow Component
 * 3-step flow: Request OTP → Verify OTP → Reset Password
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRequestOTP, useVerifyOTP, useResetPassword } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

type Step = 'request' | 'verify' | 'reset';

const requestSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+998\d{9}$/, 'Введите номер в формате +998XXXXXXXXX'),
});

const verifySchema = z.object({
  otp_code: z.string().length(6, 'Код должен содержать 6 цифр'),
});

const resetSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Пароль должен содержать заглавные и строчные буквы, и цифры'
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Пароли не совпадают',
    path: ['confirm_password'],
  });

export const ForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // Step 1: Request OTP
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest },
  } = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
  });

  const requestMutation = useRequestOTP({
    onSuccess: (response) => {
      const { expires_at } = response.data;
      setExpiresAt(expires_at);
      setStep('verify');
      toast({
        title: 'Код отправлен',
        description: 'Проверьте SMS на вашем телефоне',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmitRequest = (data: z.infer<typeof requestSchema>) => {
    setPhoneNumber(data.phone_number);
    requestMutation.mutate(data.phone_number);
  };

  // Step 2: Verify OTP
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: errorsVerify },
  } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useVerifyOTP({
    onSuccess: (response) => {
      const { verification_token } = response.data;
      setVerificationToken(verification_token);
      setStep('reset');
      toast({
        title: 'Код подтвержден',
        description: 'Теперь введите новый пароль',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Неверный код',
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmitVerify = (data: z.infer<typeof verifySchema>) => {
    verifyMutation.mutate({
      phone_number: phoneNumber,
      otp_code: data.otp_code,
    });
  };

  // Step 3: Reset Password
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  const resetMutation = useResetPassword({
    onSuccess: () => {
      toast({
        title: 'Пароль изменен',
        description: 'Теперь вы можете войти с новым паролем',
      });
      navigate('/login');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmitReset = (data: z.infer<typeof resetSchema>) => {
    resetMutation.mutate({
      verification_token: verificationToken,
      new_password: data.new_password,
    });
  };

  // Render based on current step
  if (step === 'request') {
    return (
      <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone_number">Номер телефона</Label>
          <Input
            id="phone_number"
            type="tel"
            placeholder="+998901234567"
            {...registerRequest('phone_number')}
            disabled={requestMutation.isPending}
          />
          {errorsRequest.phone_number && (
            <p className="text-sm text-destructive">
              {errorsRequest.phone_number.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={requestMutation.isPending}
        >
          {requestMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Отправить код
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к входу
        </Link>
      </form>
    );
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleSubmitVerify(onSubmitVerify)} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Код отправлен на номер <strong>{phoneNumber}</strong>
          </p>
          {expiresAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Действителен 5 минут
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp_code">Код подтверждения</Label>
          <Input
            id="otp_code"
            type="text"
            placeholder="123456"
            maxLength={6}
            {...registerVerify('otp_code')}
            disabled={verifyMutation.isPending}
          />
          {errorsVerify.otp_code && (
            <p className="text-sm text-destructive">
              {errorsVerify.otp_code.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Подтвердить
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep('request')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Изменить номер
        </Button>
      </form>
    );
  }

  // step === 'reset'
  return (
    <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new_password">Новый пароль</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="Минимум 8 символов"
          {...registerReset('new_password')}
          disabled={resetMutation.isPending}
        />
        {errorsReset.new_password && (
          <p className="text-sm text-destructive">
            {errorsReset.new_password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Подтвердите пароль</Label>
        <Input
          id="confirm_password"
          type="password"
          placeholder="Повторите пароль"
          {...registerReset('confirm_password')}
          disabled={resetMutation.isPending}
        />
        {errorsReset.confirm_password && (
          <p className="text-sm text-destructive">
            {errorsReset.confirm_password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={resetMutation.isPending}
      >
        {resetMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Сбросить пароль
      </Button>
    </form>
  );
};
