<template>
  <div class="reset-password-container">
    <PrimeCard class="reset-password-card">
      <template #header>
        <h1 style="text-align: center">Redefinir Senha</h1>
      </template>

      <template #content>
        <Transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="resetSuccess"
            class="success-state"
          >
            <div class="goal-scene">
              <span class="ball">⚽</span>
              <div class="net">
                <span class="goal-text">GOL!</span>
              </div>
            </div>
            <p class="success-message">Senha redefinida com sucesso!</p>
            <p class="redirect-message">
              Redirecionando para os Jogos em
              <strong>{{ countdown }}</strong>
              {{ countdown === 1 ? 'segundo' : 'segundos' }}...
            </p>
            <PrimeProgressBar
              :value="progressValue"
              :show-value="false"
              class="redirect-bar"
            />
            <RouterLink
              to="/jogos"
              class="skip-link"
            >
              Ir agora <i class="pi pi-arrow-right" />
            </RouterLink>
          </div>

          <Form
            v-else
            v-slot="$form"
            no-validate
            :initial-values
            :resolver="resetPasswordResolver"
            @submit="handleResetPassword"
          >
            <PrimeFloatLabel
              variant="in"
              class="input"
            >
              <PrimeInputText
                name="email"
                type="email"
                fluid
                disabled
              />
              <PrimeMessage
                v-if="$form.email?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.email.error?.message }}
              </PrimeMessage>
              <label for="email">Email</label>
            </PrimeFloatLabel>

            <PrimeFloatLabel
              variant="in"
              class="input"
            >
              <PrimeInputText
                name="token"
                type="text"
                fluid
                disabled
              />
              <PrimeMessage
                v-if="$form.token?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.token.error?.message }}
              </PrimeMessage>
              <label for="token">Token</label>
            </PrimeFloatLabel>

            <PrimeFloatLabel
              variant="in"
              class="input"
            >
              <PrimePassword
                name="password"
                type="password"
                :feedback="false"
                toggle-mask
                fluid
                autofocus
              />
              <PrimeMessage
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.password.error?.message }}
              </PrimeMessage>
              <label for="password">Nova Senha</label>
            </PrimeFloatLabel>

            <PrimeFloatLabel
              variant="in"
              class="input"
            >
              <PrimePassword
                name="confirmPassword"
                type="password"
                :feedback="false"
                toggle-mask
                fluid
              />
              <PrimeMessage
                v-if="$form.confirmPassword?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
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
        </Transition>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
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
const resetSuccess = ref(false);
const countdown = ref(10);
const progressValue = ref(100);

function startRedirectCountdown() {
  const totalMs = 10000;
  const intervalMs = 50;
  let elapsed = 0;

  const timer = setInterval(() => {
    elapsed += intervalMs;
    progressValue.value = Math.max(0, 100 - (elapsed / totalMs) * 100);
    countdown.value = Math.ceil((totalMs - elapsed) / 1000);

    if (elapsed >= totalMs) {
      clearInterval(timer);
      router.push('/jogos');
    }
  }, intervalMs);
}

const handleResetPassword = async (formData: FormSubmitEvent<Record<string, string>>) => {
  if (!formData.values) {
    return;
  }

  loading.value = true;

  try {
    const { email, password, token } = formData.values;
    await userService.updatePasswordFromToken(email, password, token);
    notificationStore.success('Senha redefinida com sucesso!', 'Redefinição de Senha');
    resetSuccess.value = true;
    startRedirectCountdown();
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
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.reset-password-card {
  width: 100%;
  max-width: 400px;
}

/* Success state */
.success-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  text-align: center;
}

/* Goal scene */
.goal-scene {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
}

.net {
  --net-line: color-mix(in srgb, var(--p-primary-color, #4caf50) 25%, transparent);

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 70px;
  /* stylelint-disable-next-line declaration-block-single-line-max-declarations */
  background:
    repeating-linear-gradient(0deg, transparent, transparent 12px, var(--net-line) 12px, var(--net-line) 13px),
    repeating-linear-gradient(90deg, transparent, transparent 12px, var(--net-line) 12px, var(--net-line) 13px);
  border: 3px solid var(--p-primary-color, #4caf50);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.goal-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--p-primary-color, #4caf50);
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px color-mix(in srgb, var(--p-primary-color, #4caf50) 60%, transparent);
  animation: pulse-goal 0.6s ease-in-out infinite alternate;
}

.ball {
  position: absolute;
  font-size: 2rem;
  animation: shoot-ball 0.5s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
}

@keyframes shoot-ball {
  from {
    opacity: 0;
    transform: translate(-60px, 20px) scale(1.3);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes pulse-goal {
  from {
    opacity: 0.7;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

.success-message {
  font-size: 1.1rem;
  font-weight: 600;
}

.redirect-message {
  font-size: 0.9rem;
  color: var(--p-text-muted-color);
}

.redirect-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
}

.skip-link {
  font-size: 0.85rem;
  color: var(--p-primary-color);
  text-decoration: none;
  opacity: 0.75;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.input {
  padding-bottom: var(--m-spacing);
}

.w-full {
  width: 100%;
}
</style>
