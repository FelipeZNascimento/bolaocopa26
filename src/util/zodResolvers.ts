import { zodResolver } from '@primevue/forms/resolvers/zod';
import { ref } from 'vue';
import z from 'zod';

export const loginResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      password: z.string().min(6, { message: 'Senha tem que ter pelo menos 6 caracteres' }),
    }),
  ),
);

export const signupResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      name: z.string().min(1, { message: 'Nome está vazio' }),
      password: z.string().min(6, { message: 'Senha tem que ter pelo menos 6 caracteres' }),
      username: z
        .string()
        .min(6, { message: 'Usuário tem que ter entre 6 e 12 caracteres' })
        .max(12, { message: 'Usuário tem que ter entre 6 e 12 caracteres' }),
    }),
  ),
);

export const updateProfileResolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, { message: 'Nome está vazio' }),
      username: z
        .string()
        .min(6, { message: 'Usuário tem que ter entre 6 e 12 caracteres' })
        .max(12, { message: 'Usuário tem que ter entre 6 e 12 caracteres' }),
    }),
  ),
);

export const updatePasswordResolver = ref(
  zodResolver(
    z
      .object({
        currentPassword: z.string().min(6, { message: 'A sua senha tem pelo menos 6 caracteres' }),
        newPassword: z.string().min(6, { message: 'Nova senha tem que ter pelo menos 6 caracteres' }),
        newPasswordConfirmation: z.string().min(6, { message: 'Nova senha tem que ter pelo menos 6 caracteres' }),
      })
      .refine((data) => data.newPassword === data.newPasswordConfirmation, {
        message: 'A senha digitada no campo de confirmação deve ser idêntica à nova senha',
        path: ['newPasswordConfirmation'], // path of error
      }),
  ),
);
