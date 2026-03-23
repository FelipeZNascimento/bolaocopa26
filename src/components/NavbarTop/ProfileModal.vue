<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="center"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Perfil</h2>
    </template>
    <Form
      noValidate
      :initialValues
      :resolver="updateProfileResolver"
      v-slot="$form"
      @submit="(formData) => onFormSubmit(formData)"
    >
      <PrimeFloatLabel variant="in" class="input">
        <PrimeInputText disabled name="email" v-model="initialValues.email" type="email" fluid autofocus />
        <label for="email">Email</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel variant="in" class="input">
        <PrimeInputText :disabled="isLoading" name="name" type="text" fluid />
        <PrimeMessage v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
          {{ $form.name.error?.message }}
        </PrimeMessage>
        <label for="name">Nome</label>
      </PrimeFloatLabel>
      <PrimeFloatLabel variant="in" class="input">
        <PrimeInputText :disabled="isLoading" name="nickname" type="text" fluid />
        <PrimeMessage v-if="$form.nickname?.invalid" severity="error" size="small" variant="simple">
          {{ $form.nickname.error?.message }}
        </PrimeMessage>
        <label for="nickname">Apelido</label>
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
import { updateProfileResolver } from '@/util/zodResolvers';

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
const activeProfile = computed(() => activeProfileStore.activeProfile);
const initialValues = computed(() => {
  return {
    email: activeProfile.value?.email,
    name: activeProfile.value?.name,
    nickname: activeProfile.value?.nickname,
  };
});

// ------ Functions ------
function onFormSubmit(formData: FormSubmitEvent<Record<string, string>>) {
  if (!formData.values) {
    return;
  }

  activeProfileStore.setError(null);
  isUpdateSuccess.value = false;
  const { name, nickname } = formData.values;
  if (name === activeProfile.value?.name && nickname === activeProfile.value?.nickname) {
    return updateCallback(true);
  }

  userService.updateProfile(updateCallback, name, nickname);
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
