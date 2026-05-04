<template>
  <div
    class="floating-actions"
    :class="{ scrolled: isScrolled }"
  >
    <button
      v-tooltip.right="hasChanges ? 'Salvar apostas' : ''"
      class="action-btn save-btn"
      :class="{ active: hasChanges, disabled: !hasChanges || isSaving }"
      :disabled="!hasChanges || isSaving"
      :aria-label="'Salvar apostas'"
      :title="hasChanges ? 'Salvar apostas' : 'Nenhuma alteração para salvar'"
      @click="handleSave"
    >
      <i
        class="pi"
        :class="isSaving ? 'pi-spin pi-spinner' : 'pi-save'"
      />
    </button>

    <button
      v-if="hasChanges"
      v-tooltip.right="'Descartar alterações'"
      class="action-btn reset-btn"
      :disabled="isSaving"
      :aria-label="'Descartar alterações'"
      :title="'Descartar alterações'"
      @click="handleReset"
    >
      <i class="pi pi-undo" />
    </button>

    <button
      v-if="isDesktop"
      v-tooltip.right="rankingPosition === 'active' ? 'Esconder ranking' : 'Mostrar ranking'"
      class="action-btn"
      :class="{ active: rankingPosition === 'modal' }"
      :aria-label="'Esconder ranking'"
      :title="'Esconder ranking'"
      @click="handleHideRanking"
    >
      <i
        class="pi"
        :class="{ 'pi-eye-slash': rankingPosition === 'modal', 'pi-eye': rankingPosition !== 'modal' }"
      />
    </button>

    <button
      v-if="selectedRound === 1 || selectedRound === 2 || selectedRound === 3"
      v-tooltip.right="groupToggleState ? 'Por horário' : 'Por grupos'"
      class="action-btn"
      :class="{ active: groupToggleState }"
      :aria-label="groupToggleState ? 'Desagrupar times' : 'Agrupar por grupos'"
      :title="groupToggleState ? 'Desagrupar times' : 'Agrupar por grupos'"
      @click="handleListToggle"
    >
      <i :class="groupToggleState ? 'pi pi-objects-column' : 'pi pi-list'" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import BetService from '@/services/bet';
import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps<{
  groupToggleState: boolean;
  onToggleGroupView: () => void;
  selectedRound: null | number;
}>();

// ------ Refs ------
const isScrolled = ref(false);
const isSaving = ref(false);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();
const notificationStore = useNotificationStore();
const betService = new BetService();
const { isDesktop } = useViewport();

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const hasChanges = computed(() => matchesStore.hasAnyChanges());

// ------ Functions ------
const handleSave = async () => {
  const changes = matchesStore.getChangedBets();

  if (changes.length === 0) return;

  isSaving.value = true;

  try {
    // Batch save all changes
    const promises = changes.map((bet) =>
      betService.placeBet(
        {
          awayScore: bet.scoreAway,
          homeScore: bet.scoreHome,
          matchId: bet.matchId,
        },
        (isSuccess, error) => {
          if (!isSuccess) {
            throw error || new Error('Erro ao salvar aposta');
          }
        },
      ),
    );

    await Promise.all(promises);

    // Success: commit working bets to original
    matchesStore.commitWorkingBets();

    notificationStore.success(
      `${changes.length} ${changes.length === 1 ? 'aposta salva' : 'apostas salvas'} com sucesso!`,
      'Sucesso',
    );
  } catch (error) {
    notificationStore.error(error instanceof Error ? error.message : 'Ocorreu um erro ao salvar as apostas', 'Erro');
  } finally {
    isSaving.value = false;
  }
};

const handleReset = () => {
  matchesStore.resetWorkingBets();
  notificationStore.message('Todas as alterações foram descartadas', 'Alterações descartadas');
};

const handleHideRanking = () => {
  const newOption = rankingPosition.value === 'active' ? 'modal' : 'active';
  configurationStore.setRankingPosition(newOption);
};

const handleListToggle = () => {
  props.onToggleGroupView();
};
</script>
<style scoped lang="scss">
.floating-actions {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  transition: top 0.3s ease;

  &.scrolled {
    top: 20px;
  }

  @media (width <= 1024px) {
    inset: auto 0 0;
    flex-direction: row;
    justify-content: center;
    padding: var(--s-spacing) 0;
    background-color: var(--bolao-c-blue5-t2);

    &.scrolled {
      top: auto;
    }
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  cursor: pointer;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    // background: var(--color-background-mute);
    box-shadow: 0 6px 16px rgb(0 0 0 / 25%);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &.active {
    background: linear-gradient(135deg, var(--bolao-c-fifa-green1), var(--bolao-c-fifa-blue));

    .pi {
      color: white;
    }
  }

  &.disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &.save-btn.active {
    background: var(--bolao-c-mint-d2);
    border-color: var(--bolao-c-mint-d1);

    .pi {
      color: white;
    }

    &:hover:not(:disabled) {
      background: var(--bolao-c-mint-d1);
    }
  }

  &.reset-btn {
    background: var(--bolao-c-red-l1);
    border-color: var(--bolao-c-red);

    .pi {
      color: white;
    }

    &:hover:not(:disabled) {
      background: var(--bolao-c-red);
    }
  }

  .pi {
    font-size: 1.25rem;
    color: var(--color-text);
    transition: color 0.3s ease;
  }

  @media (width <= 768px) {
    width: 44px;
    height: 44px;

    .pi {
      font-size: 1.1rem;
    }
  }

  @media (width <= 480px) {
    width: 40px;
    height: 40px;

    .pi {
      font-size: 1rem;
    }
  }
}
</style>
