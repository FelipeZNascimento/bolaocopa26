import { zodResolver } from '@primevue/forms/resolvers/zod';
import z from 'zod';

import i18n from '@/i18n';

const t = i18n.global.t;

export const loginResolver = zodResolver(
  z.object({
    email: z.email({ error: t('loginModal.validation.emailInvalid') }),
    password: z.string().min(6, { message: t('loginModal.validation.passwordMinLength') }),
  }),
);

export const signupResolver = zodResolver(
  z.object({
    email: z.email({ error: t('loginModal.validation.emailInvalid') }),
    name: z.string().min(1, { message: t('loginModal.validation.nameEmpty') }),
    nickname: z
      .string()
      .min(4, { message: t('loginModal.validation.nicknameLength') })
      .max(12, { message: t('loginModal.validation.nicknameLength') }),
    password: z.string().min(6, { message: t('loginModal.validation.passwordMinLength') }),
  }),
);

export const updateProfileResolver = zodResolver(
  z.object({
    name: z.string().min(1, { message: t('loginModal.validation.nameEmpty') }),
    nickname: z
      .string()
      .min(4, { message: t('loginModal.validation.nicknameLength') })
      .max(12, { message: t('loginModal.validation.nicknameLength') }),
  }),
);

export const updatePasswordResolver = zodResolver(
  z
    .object({
      currentPassword: z.string().min(6, { message: t('loginModal.validation.passwordMinLength') }),
      newPassword: z.string().min(6, { message: t('loginModal.validation.passwordMinLength') }),
      newPasswordConfirmation: z.string().min(6, { message: t('loginModal.validation.passwordMinLength') }),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: t('loginModal.validation.passwordConfirmationMismatch'),
      path: ['newPasswordConfirmation'],
    }),
);

export const forgotPasswordResolver = zodResolver(
  z.object({ email: z.email({ error: t('loginModal.validation.emailInvalid') }) }),
);

export const resetPasswordResolver = zodResolver(
  z
    .object({
      confirmPassword: z.string().min(1, { message: t('resetPassword.validation.confirmPasswordEmpty') }),
      email: z.string().email({ message: t('resetPassword.validation.emailRequired') }),
      password: z.string().min(6, { message: t('resetPassword.validation.passwordMinLength') }),
      token: z.string().min(1, { message: t('resetPassword.validation.tokenRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('resetPassword.validation.passwordsMismatch'),
      path: ['confirmPassword'],
    }),
);
