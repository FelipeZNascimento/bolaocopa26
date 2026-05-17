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
      <h2>{{ formTitle }}</h2>
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
        <label for="email">{{ t('loginModal.fields.email') }}</label>
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
        <label for="password">{{ t('loginModal.fields.password') }}</label>
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
        <label for="name">{{ t('loginModal.fields.name') }}</label>
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
        <label for="nickname">{{ t('loginModal.fields.nickname') }}</label>
      </PrimeFloatLabel>
      <div class="buttons-container">
        <PrimeButton
          rounded
          :disabled="isLoading"
          :label="t('loginModal.buttons.forgotPassword')"
          variant="text"
          severity="secondary"
          @click="setFormMode('forgotPassword')"
        >
          {{ t('loginModal.buttons.forgotPassword') }}
        </PrimeButton>
        <PrimeButton
          rounded
          type="submit"
          :label="t('loginModal.buttons.confirm')"
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
    <div style="padding-top: var(--l-spacing); text-align: center">
      <PrimeButton
        v-if="formMode !== 'login'"
        rounded
        class="signup-button"
        type="submit"
        :label="t('loginModal.buttons.backToLogin')"
        variant="link"
        severity="secondary"
        :disabled="isLoading"
        @click="setFormMode('login')"
      />
      <PrimeButton
        v-else
        rounded
        type="submit"
        :label="t('loginModal.buttons.signup')"
        variant="link"
        severity="secondary"
        :disabled="isLoading"
        @click="setFormMode('signup')"
      />
    </div>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { computed, ref, type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

const { t } = useI18n();

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

const forgotPasswordResolver = ref(
  zodResolver(z.object({ email: z.email({ error: t('loginModal.validation.emailInvalid') }) })),
);

const loginResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: t('loginModal.validation.emailInvalid') }),
      password: z.string().min(1, { message: t('loginModal.validation.passwordEmpty') }),
    }),
  ),
);

const signupResolver = ref(
  zodResolver(
    z.object({
      email: z.email({ error: t('loginModal.validation.emailInvalid') }),
      name: z.string().min(1, { message: t('loginModal.validation.nameEmpty') }),
      nickname: z
        .string()
        .min(4, { message: t('loginModal.validation.nicknameLength') })
        .max(12, { message: t('loginModal.validation.nicknameLength') }),
      password: z.string().min(1, { message: t('loginModal.validation.passwordEmpty') }),
    }),
  ),
);

// ------ Initializations ------
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();
const notificationStore = useNotificationStore();

// ------ Computed Properties ------
const isLoading = computed(() => activeProfileStore.isLoading);
const loginError = computed(() => activeProfileStore.error);
const formTitle = computed(() => {
  if (formMode.value === 'signup') {
    return t('loginModal.titles.signup');
  } else if (formMode.value === 'login') {
    return t('loginModal.titles.login');
  } else if (formMode.value === 'forgotPassword') {
    return t('loginModal.titles.forgotPassword');
  }
  return t('loginModal.titles.login');
});

// ------ Functions  ------
function forgotPasswordCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    props.handleCloseModal();
    notificationStore.success(t('loginModal.notifications.forgotPasswordSent'));
  }
}
function loginCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    props.handleCloseModal();
  }
}

function onForgotPasswordSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  activeProfileStore.setError(null);
  if (!formData.values) {
    return;
  }

  const { email } = formData.values;
  userService.forgotPassword(email, forgotPasswordCallback);
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
  userService.signup(email, password, name, nickname, submitCallback);
}

function resetState() {
  formMode.value = 'login';
  activeProfileStore.setError(null);
}

function setFormMode(mode: 'forgotPassword' | 'login' | 'signup') {
  formMode.value = mode;
  activeProfileStore.setError(null);
}

function submitCallback(isSuccess: boolean) {
  if (isSuccess) {
    isVisible.value = false;
    props.handleCloseModal();
    notificationStore.success(
      t('loginModal.notifications.signupSuccess'),
      t('loginModal.notifications.signupSuccessTitle'),
    );
  }
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
<style lang="scss" scoped>
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

:deep(.p-dialog-footer) {
  justify-content: center;
}
</style>
