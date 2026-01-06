<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>{{ isSignupMode ? 'Cadastro' : 'Login' }}</h2>
    </template>
    <Form
      noValidate
      :initialValues
      :resolver="isSignupMode ? signupResolver : loginResolver"
      v-slot="$form"
      @submit="(formData) => onFormSubmit(formData)"
    >
      <PrimeFloatLabel variant="in" class="input">
        <PrimeInputText name="email" type="email" fluid autofocus />
        <PrimeMessage v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
          {{ $form.email.error?.message }}
        </PrimeMessage>
        <label for="email">Email</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel variant="in" class="input">
        <PrimePassword name="password" type="password" :feedback="false" toggleMask fluid />
        <PrimeMessage v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
          {{ $form.password.error?.message }}
        </PrimeMessage>
        <label for="password">Senha</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel v-if="isSignupMode" variant="in" class="input">
        <PrimeInputText name="name" type="text" fluid />
        <PrimeMessage v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
          {{ $form.name.error?.message }}
        </PrimeMessage>
        <label for="name">Nome Completo</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel v-if="isSignupMode" variant="in" class="input">
        <PrimeInputText name="username" type="text" fluid />
        <PrimeMessage v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
          {{ $form.username.error?.message }}
        </PrimeMessage>
        <label for="username">Usuário</label>
      </PrimeFloatLabel>
      <div class="buttons-container">
        <PrimeButton
          rounded
          :disabled="isLoading"
          label="Esqueci a senha"
          variant="text"
          severity="secondary"
          @click="$form.reset()"
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
      <p style="text-align: center; padding-top: var(--l-spacing)" v-show="loginError">
        <PrimeTag severity="contrast" icon="pi pi-exclamation-triangle" :value="loginError?.message" />
      </p>
    </Form>
    <template v-if="!isSignupMode" #footer>
      <PrimeButton
        rounded
        @click="toggleMode"
        class="signup-button"
        type="submit"
        label="Faça aqui o seu cadastro"
        variant="primary"
        severity="secondary"
        icon="pi pi-check"
        :disabled="isLoading"
      />
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const isSignupMode = ref(false);
const initialValues = ref({
  email: '',
  name: '',
  password: '',
  username: '',
});
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
      password: z.string().min(1, { message: 'Senha está vazia' }),
      username: z
        .string()
        .min(6, { message: 'Usuário tem que ter entre 6 e 12 caracteres' })
        .max(12, { message: 'Usuário tem que ter entre 6 e 12 caracteres' }),
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
function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (isSignupMode.value) {
    onSignupSubmit(formData);
  } else {
    onLoginSubmit(formData);
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

  const { email, name, password, username } = formData.values;
  userService.signup(email, password, name, username, loginCallback);
}

function resetState() {
  isSignupMode.value = false;
  activeProfileStore.setError(null);
}

function toggleMode() {
  isSignupMode.value = !isSignupMode.value;
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
  justify-content: center;
  gap: var(--m-spacing);
}

.signup-button {
  width: 100%;
}
</style>
