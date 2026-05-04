<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>{{ formMode === 'signup' ? 'Cadastro' : 'Login' }}</h2>
    </template>
    <Form
      v-slot="$form"
      no-validate
      :initial-values
      :resolver="resolverDecider()"
      @submit="(formData) => onFormSubmit(formData)"
    >
      <PrimeFloatLabel
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="email"
          type="email"
          fluid
          autofocus
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
        v-if="formMode !== 'forgotPassword'"
        variant="in"
        class="input"
      >
        <PrimePassword
          name="password"
          type="password"
          :feedback="false"
          toggle-mask
          fluid
        />
        <PrimeMessage
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.password.error?.message }}
        </PrimeMessage>
        <label for="password">Senha</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel
        v-if="formMode === 'signup'"
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="name"
          type="text"
          fluid
        />
        <PrimeMessage
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error?.message }}
        </PrimeMessage>
        <label for="name">Nome Completo</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel
        v-if="formMode === 'signup'"
        variant="in"
        class="input"
      >
        <PrimeInputText
          name="nickname"
          type="text"
          fluid
        />
        <PrimeMessage
          v-if="$form.nickname?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.nickname.error?.message }}
        </PrimeMessage>
        <label for="nickname">Apelido</label>
      </PrimeFloatLabel>
      <div class="buttons-container">
        <PrimeButton
          rounded
          :disabled="isLoading"
          label="Esqueci a senha"
          variant="text"
          severity="secondary"
          @click="setFormMode('forgotPassword')"
        >
          Esqueci a senha
        </PrimeButton>
        <PrimeButton
          rounded
          type="submit"
          label="Confirmar"
          variant="primary"
          severity="primary"
          icon="pi pi-check"
          :loading="isLoading"
        />
      </div>
      <p
        v-show="loginError"
        style="padding-top: var(--l-spacing); text-align: center"
      >
        <PrimeTag
          severity="contrast"
          icon="pi pi-exclamation-triangle"
          :value="loginError?.message"
        />
      </p>
    </Form>
    <template #footer>
      <PrimeButton
        v-if="formMode !== 'login'"
        rounded
        class="signup-button"
        type="submit"
        label="Voltar para o login"
        variant="link"
        severity="secondary"
        :disabled="isLoading"
        @click="setFormMode('login')"
      />
      <PrimeButton
        v-else
        rounded
        class="signup-button"
        type="submit"
        label="Faça aqui o seu cadastro"
        variant="link"
        severity="secondary"
        :disabled="isLoading"
        @click="setFormMode('signup')"
      />
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, ref, type Ref, watch } from 'vue';
import { z } from 'zod';

import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const formMode: Ref<'forgotPassword' | 'login' | 'signup'> = ref('login');
const initialValues = ref({
  email: '',
  name: '',
  nickname: '',
  password: '',
});
const resolverDecider = () => {
  if (formMode.value === 'signup') {
    return signupResolver.value;
  } else if (formMode.value === 'login') {
    return loginResolver.value;
  } else if (formMode.value === 'forgotPassword') {
    return forgotPasswordResolver.value;
  }
  return loginResolver.value;
};

const forgotPasswordResolver = ref(zodResolver(z.object({ email: z.email({ error: 'Email inválido' }) })));

const loginResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      password: z.string().min(1, { message: 'Senha está vazia' }),
    }),
  ),
);

const signupResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: 'Email inválido' }),
      name: z.string().min(1, { message: 'Nome está vazio' }),
      nickname: z
        .string()
        .min(4, { message: 'Apelido tem que ter entre 4 e 12 caracteres' })
        .max(12, { message: 'Apelido tem que ter entre 4 e 12 caracteres' }),
      password: z.string().min(1, { message: 'Senha está vazia' }),
    }),
  ),
);

// ------ Initializations ------
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const isLoading = computed(() => activeProfileStore.isLoading);
const loginError = computed(() => activeProfileStore.error);

function loginCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    props.handleCloseModal();
  }
}

// ------ Functions  ------
function onForgotPasswordSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  activeProfileStore.setError(null);
  if (!formData.values) {
    return;
  }

  const { email } = formData.values;
  userService.forgotPassword(email, loginCallback);
}

function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (formMode.value === 'signup') {
    onSignupSubmit(formData);
  } else if (formMode.value === 'login') {
    onLoginSubmit(formData);
  } else if (formMode.value === 'forgotPassword') {
    onForgotPasswordSubmit(formData);
  }
}

function onLoginSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  activeProfileStore.setError(null);
  if (!formData.values) {
    return;
  }

  const { email, password } = formData.values;
  userService.login(email, password, loginCallback);
}

function onSignupSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.values) {
    return;
  }

  const { email, name, nickname, password } = formData.values;
  userService.signup(email, password, name, nickname, loginCallback);
}

function resetState() {
  formMode.value = 'login';
  activeProfileStore.setError(null);
}

function setFormMode(mode: 'forgotPassword' | 'login' | 'signup') {
  formMode.value = mode;
  activeProfileStore.setError(null);
}

// ------ Watches  ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    resetState();
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.input {
  padding-bottom: var(--m-spacing);
}

.buttons-container {
  display: flex;
  gap: var(--m-spacing);
  justify-content: center;
}

.signup-button {
  width: 100%;
}
</style>
