<template>
  <div class="admin-view">
    <h2>Admin</h2>
    <div style="display: flex">
      <PrimeSelectButton
        v-model="selectedOption"
        :options="options"
        optionLabel="name"
      />

      <PrimeDivider layout="vertical" />
      <PrimeButton
        style="margin-bottom: var(--s-spacing)"
        label="Flush Cache"
        severity="danger"
        @click="handleFlushCache"
      />
    </div>
    <template v-if="selectedOption.value === 1">
      <p style="margin-top: var(--m-spacing)">
        <PrimeButton
          style="margin-bottom: var(--s-spacing)"
          label="Refresh Users"
          @click="userService.getAll(getUsersCallback)"
        />
      </p>
      <p>Usuários: {{ users.filter((u) => u.isActive).length }}/{{ users.length }}</p>
      <PrimeDataTable
        :value="users"
        :loading="isLoading || isLoadingActiveProfile"
        striped-rows
        row-hover
        size="small"
      >
        <PrimeColumn
          header="Online"
          field="isOnline"
        >
          <template #body="{ data }">
            <OnlineBadge :is-online="!!data.isOnline" />
          </template>
        </PrimeColumn>
        <PrimeColumn
          header="ID"
          field="id"
          sortable
        />
        <PrimeColumn
          header="Nome"
          field="name"
          sortable
        />
        <PrimeColumn
          header="Apelido"
          field="nickname"
          sortable
        />
        <PrimeColumn
          field="extrasCount"
          style="text-align: center"
          sortable
        >
          <template #header><div style="width: 100%; text-align: center">Extras</div></template>
          <template #body="{ data }">
            <i
              v-if="data.extrasCount >= MAX_EXTRAS"
              class="pi pi-check-circle"
              style="color: var(--bolao-c-mint)"
            />
            <i
              v-else
              class="pi pi-times-circle"
              style="color: var(--bolao-c-red-l1)"
            />
            {{ data.extrasCount }} / {{ MAX_EXTRAS }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="isActive"
          style="text-align: center"
          sortable
        >
          <template #header><div style="width: 100%; text-align: center">Ativo</div></template>
          <template #body="{ data }">
            <PrimeToggleSwitch
              :model-value="!!data.isActive"
              @click.prevent="handleActiveToggle(data)"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn style="text-align: center">
          <template #header><div style="width: 100%; text-align: center">Unlink de 2026</div></template>
          <template #body="{ data }">
            <PrimeButton
              icon="pi pi-minus-circle"
              severity="danger"
              variant="text"
              size="small"
              @click="handleDelete(data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </template>
    <template v-else>
      <p style="margin-top: var(--m-spacing)">
        <PrimeButton
          style="margin-bottom: var(--s-spacing)"
          label="Refresh Status"
          @click="startupService.serverHealth()"
        />
      </p>
      <p>DB: {{ serverHealth?.db }}</p>
      <p>Status: {{ serverHealth?.status }}</p>
      <p>Pool</p>
      <ul>
        <li>All Connections: {{ serverHealth?.pool.activeConnections }}</li>
        <li>Free Connections: {{ serverHealth?.pool.freeConnections }}</li>
        <li>Queue Length: {{ serverHealth?.pool.queuedRequests }}</li>
        <li>Connection Limit: {{ serverHealth?.pool.connectionLimit }}</li>
      </ul>
      <p>Cache</p>
      <ul>
        <li>Hits: {{ serverHealth?.cacheStats.hits }}</li>
        <li>Misses: {{ serverHealth?.cacheStats.misses }}</li>
        <li>Keys: {{ serverHealth?.cacheStats.keys }}</li>
        <li>Vsize: {{ serverHealth?.cacheStats.vsize }}</li>
      </ul>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import type { IUser } from '@/stores/activeProfile.types';

import OnlineBadge from '@/components/OnlineBadge.vue';
import RankingService from '@/services/ranking';
import StartupService from '@/services/startup';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useAdminStore } from '@/stores/admin';
import { useNotificationStore } from '@/stores/notification';

const MAX_EXTRAS = 5;
const selectedOption = ref({ name: 'Users', value: 1 });
const options = ref([
  { name: 'Users', value: 1 },
  { name: 'Health Status', value: 2 },
]);

// ------ Services & Stores ------
const activeProfileStore = useActiveProfileStore();
const adminStore = useAdminStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const confirm = useConfirm();
const userService = new UserService();
const rankingService = new RankingService();
const startupService = new StartupService();

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoadingActiveProfile = computed(() => activeProfileStore.isLoading);
const isLoading = computed(() => adminStore.isLoading);
const users = computed(() => adminStore.users);
const serverHealth = computed(() => adminStore.serverHealth);

// ------ Functions ------
function activateToggleCallback(success: boolean) {
  console.log('Activate toggle callback success:', success);
  if (success) {
    rankingService.fetch();
    notificationStore.success('Estado do usuário atualizado com sucesso.');
  } else {
    notificationStore.error('Falha ao atualizar o estado do usuário.');
  }
}
function deleteCallback(success: boolean) {
  if (success) {
    rankingService.fetch();
    notificationStore.success('Usuário removido com sucesso.');
  } else {
    notificationStore.error('Falha ao remover o usuário.');
  }
}

function getUsersCallback(success: boolean) {
  if (!success) {
    console.error('Failed to load users for admin view.');
  }
}

function handleActiveToggle(user: IUser) {
  confirm.require({
    accept: () => {
      console.log('Changing active state for user:', user.id);
      userService.activateUser(user.id, !user.isActive, activateToggleCallback);
    },
    acceptProps: { label: 'Confirmar', severity: 'danger' },
    header: user.isActive ? `Desativar "${user.nickname}"` : `Ativar "${user.nickname}"`,
    icon: 'pi pi-exclamation-triangle',
    message: user.isActive
      ? `Tem certeza que deseja desativar "${user.nickname}"?`
      : `Tem certeza que deseja ativar "${user.nickname}"?`,
    rejectProps: { label: 'Cancelar', severity: 'secondary', variant: 'text' },
  });
}

function handleDelete(user: IUser) {
  confirm.require({
    accept: () => {
      console.log('Deleting user:', user.id);
      userService.deleteUser(user.id, deleteCallback);
    },
    acceptProps: { label: 'Remover', severity: 'danger' },
    header: `Confirmar unlink de "${user.nickname}"`,
    icon: 'pi pi-exclamation-triangle',
    message: `Tem certeza que deseja remover "${user.nickname}" do Bolão 2026?`,
    rejectProps: { label: 'Cancelar', severity: 'secondary', variant: 'text' },
  });
}

function handleFlushCache() {
  confirm.require({
    accept: () => {
      startupService.cacheFlush();
    },
    acceptProps: { label: 'Confirmar', severity: 'danger' },
    header: 'Confirmar Flush Cache',
    icon: 'pi pi-exclamation-triangle',
    message: 'Tem certeza que deseja limpar o cache?',
    rejectProps: { label: 'Cancelar', severity: 'secondary', variant: 'text' },
  });
}

onMounted(() => {
  startupService.serverHealth();
});

// ------ Watches ------
watch(
  [activeProfile, isLoadingActiveProfile],
  ([profile, loading]) => {
    if (loading) return;
    if (!profile || !profile.admin) {
      router.replace('/partidas');
      return;
    }
    userService.getAll(getUsersCallback);
    startupService.serverHealth();
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
.admin-view {
  padding: var(--l-spacing);
}
</style>
