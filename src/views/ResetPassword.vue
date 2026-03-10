<template>
  <div class="reset-password-container">
    <PrimeCard class="reset-password-card">
      <template #header>
        <h1 style="text-align: center">Redefinir Senha</h1>
      </template>

      <template #content>
        <Form noValidate :initialValues :resolver="resetPasswordResolver" v-slot="$form" @submit="handleResetPassword">
          <PrimeFloatLabel variant="in" class="input">
            <PrimeInputText name="email" type="email" fluid disabled />
            <PrimeMessage v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
              {{ $form.email.error?.message }}
            </PrimeMessage>
            <label for="email">Email</label>
          </PrimeFloatLabel>

          <PrimeFloatLabel variant="in" class="input">
            <PrimeInputText name="token" type="text" fluid disabled />
            <PrimeMessage v-if="$form.token?.invalid" severity="error" size="small" variant="simple">
              {{ $form.token.error?.message }}
            </PrimeMessage>
            <label for="token">Token</label>
          </PrimeFloatLabel>

          <PrimeFloatLabel variant="in" class="input">
            <PrimePassword name="password" type="password" :feedback="false" toggleMask fluid autofocus />
            <PrimeMessage v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
              {{ $form.password.error?.message }}
            </PrimeMessage>
            <label for="password">Nova Senha</label>
          </PrimeFloatLabel>

          <PrimeFloatLabel variant="in" class="input">
            <PrimePassword name="confirmPassword" type="password" :feedback="false" toggleMask fluid />
            <PrimeMessage v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">
              {{ $form.confirmPassword.error?.message }}
            </PrimeMessage>
            <label for="confirmPassword">Confirme a Senha</label>
          </PrimeFloatLabel>

          <PrimeButton
            rounded
            type="submit"
            label="Redefinir Senha"
            variant="primary"
            severity="primary"
            icon="pi pi-check"
            :loading="loading"
            class="w-full"
          />
        </Form>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

import UserService from '@/services/user';
import { useNotificationStore } from '@/stores/notification';

// ------ Initializations ------
const userService = new UserService();
const notificationStore = useNotificationStore();
const route = useRoute();
const router = useRouter();
const tokenFromQuery = (route.query.token as string) || '';
const emailFromQuery = (route.query.email as string) || '';

const initialValues = ref({
  confirmPassword: '',
  email: emailFromQuery,
  password: '',
  token: tokenFromQuery,
});

// Remove query params from URL after reading them
onMounted(() => {
  if (route.query.token || route.query.email) {
    router.replace({ query: {} });
  }
});

const resetPasswordResolver = zodResolver(
  z
    .object({
      confirmPassword: z.string().min(1, { message: 'Confirme a senha' }),
      email: z.string().email({ message: 'Email é obrigatório' }),
      password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
      token: z.string().min(1, { message: 'Token é obrigatório' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }),
);

const loading = ref(false);

const handleResetPassword = async (formData: FormSubmitEvent<Record<string, string>>) => {
  if (!formData.values) {
    return;
  }

  loading.value = true;

  try {
    const { email, password, token } = formData.values;
    await userService.updatePasswordFromToken(email, password, token);
    notificationStore.success('Senha redefinida com sucesso!', 'Redefinição de Senha');
  } catch (error: unknown) {
    const errorMessage = (error as Error).message || 'Falha ao redefinir a senha';
    notificationStore.error(errorMessage, 'Falha na Redefinição da Senha');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.reset-password-card {
  width: 100%;
  max-width: 400px;
}

.input {
  padding-bottom: var(--m-spacing);
}

.w-full {
  width: 100%;
}
</style>
