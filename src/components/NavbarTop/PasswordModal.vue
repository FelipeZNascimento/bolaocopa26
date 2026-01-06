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
      <h2>Alterar Senha</h2>
    </template>
    <Form
      noValidate
      :initialValues
      :resolver="updatePasswordResolver"
      v-slot="$form"
      @submit="(formData) => onFormSubmit(formData)"
    >
      <PrimeFloatLabel variant="in" class="input">
        <PrimePassword name="currentPassword" type="password" :feedback="false" toggleMask fluid />
        <PrimeMessage v-if="$form.currentPassword?.invalid" severity="error" size="small" variant="simple">
          {{ $form.currentPassword.error?.message }}
        </PrimeMessage>
        <label for="currentPassword">Senha atual</label>
      </PrimeFloatLabel>

      <PrimeFloatLabel variant="in" class="input">
        <PrimePassword name="newPassword" type="password" :feedback="false" toggleMask fluid />
        <PrimeMessage v-if="$form.newPassword?.invalid" severity="error" size="small" variant="simple">
          {{ $form.newPassword.error?.message }}
        </PrimeMessage>
        <label for="currentPassword">Nova senha</label>
      </PrimeFloatLabel>

      <PrimeFloatLabel variant="in" class="input">
        <PrimePassword name="newPasswordConfirmation" type="password" :feedback="false" toggleMask fluid />
        <PrimeMessage v-if="$form.newPasswordConfirmation?.invalid" severity="error" size="small" variant="simple">
          {{ $form.newPasswordConfirmation.error?.message }}
        </PrimeMessage>
        <label for="currentPassword">Confirme a nova senha</label>
      </PrimeFloatLabel>

      <div class="buttons-container">
        <PrimeButton
          rounded
          type="submit"
          label="Confirmar"
          variant="primary"
          severity="secondary"
          icon="pi pi-check"
          :loading="isLoading"
        />
        <p v-show="isUpdateSuccess">
          <PrimeTag severity="success" icon="pi pi-check" value="Alterações salvas com sucesso"></PrimeTag>
        </p>
        <p style="text-align: center; padding-top: var(--l-spacing)" v-show="error">
          <PrimeTag severity="contrast" icon="pi pi-exclamation-triangle" :value="error?.message" />
        </p>
      </div>
    </Form>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { computed, ref, watch } from 'vue';

import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { updatePasswordResolver } from '@/util/zodResolvers';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isUpdateSuccess = ref(false);
const isVisible = ref(false);

// ------ Initializations ------
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const isLoading = computed(() => activeProfileStore.isLoading);
const error = computed(() => activeProfileStore.error);
const initialValues = computed(() => {
  return {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  };
});

// ------ Functions ------
function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.values || formData.values.newPassword !== formData.values.newPasswordConfirmation) {
    return;
  }

  isUpdateSuccess.value = false;
  const { currentPassword, newPassword } = formData.values;

  if (currentPassword === newPassword) {
    return updateCallback(true);
  }

  userService.updatePassword(currentPassword, newPassword, updateCallback);
}

function updateCallback(isSuccess: boolean) {
  if (isSuccess) {
    isUpdateSuccess.value = true;
  }
}

// ------ Watches ------
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
    isUpdateSuccess.value = false;
    activeProfileStore.setError(null);
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--m-spacing);
}

.signup-button {
  width: 100%;
}
</style>
