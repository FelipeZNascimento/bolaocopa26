<template>
  <div
    class="floating-actions"
    :class="{ scrolled: isScrolled }"
  >
    <div class="button-outer">
      <button
        v-tooltip.right="saveButtonTooltip"
        class="action-btn save-btn"
        :class="{
          'has-valid-changes': hasChanges && allChangesAreValid,
          'has-invalid-changes': hasChanges && !allChangesAreValid,
          'no-changes': !hasChanges,
          disabled: isSaving,
        }"
        :disabled="isSaving"
        :aria-label="'Salvar apostas'"
        @click="handleSave"
      >
        <i
          class="pi"
          :class="isSaving ? 'pi-spin pi-spinner' : 'pi-save'"
        />
        <span
          v-if="hasChanges"
          class="validation-badge"
          :class="{ valid: allChangesAreValid, invalid: !allChangesAreValid }"
        >
          {{ allChangesAreValid ? '✓' : invalidBetsCount }}
        </span>
      </button>
      <p style="font-size: var(--xs-font-size)">Salvar</p>
    </div>
    <div class="button-outer">
      <button
        v-tooltip.right="'Descartar alterações'"
        class="action-btn reset-btn"
        :disabled="isSaving || !hasChanges"
        :aria-label="'Descartar alterações'"
        @click="handleReset"
      >
        <i class="pi pi-undo" />
      </button>
      <p style="font-size: var(--xs-font-size)">Descartar</p>
    </div>
    <div
      v-if="isDesktop"
      class="button-outer"
    >
      <button
        v-tooltip.right="rankingPosition === 'active' ? 'Esconder ranking' : 'Mostrar ranking'"
        class="action-btn ranking-btn"
        :class="{ active: rankingPosition === 'modal' }"
        :aria-label="'Esconder ranking'"
        @click="handleHideRanking"
      >
        <i
          class="pi"
          :class="{ 'pi-eye-slash': rankingPosition === 'modal', 'pi-eye': rankingPosition !== 'modal' }"
        />
      </button>
      <p style="font-size: var(--xs-font-size)">Ranking</p>
    </div>

    <div
      v-if="selectedRound === 1 || selectedRound === 2 || selectedRound === 3"
      class="button-outer"
    >
      <button
        v-tooltip.right="matchListSorting === 'group' ? 'Por horário' : 'Por grupos'"
        class="action-btn"
        :class="{ active: matchListSorting === 'group' }"
        :aria-label="matchListSorting === 'group' ? 'Desagrupar times' : 'Agrupar por grupos'"
        :title="matchListSorting === 'group' ? 'Desagrupar times' : 'Agrupar por grupos'"
        @click="handleListToggle"
      >
        <i :class="matchListSorting === 'group' ? 'pi pi-objects-column' : 'pi pi-list'" />
      </button>
      <p style="font-size: var(--xs-font-size)">Listar</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import BetService from '@/services/bet';
import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useNotificationStore } from '@/stores/notification';

defineProps<{
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Watch for save trigger from keyboard shortcuts
watch(
  () => matchesStore.saveTrigger,
  () => {
    handleSave();
  },
);

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const matchListSorting = computed(() => configurationStore.matchListSorting);
const hasChanges = computed(() => matchesStore.hasAnyChanges());
const allChangesAreValid = computed(() =>
  matchesStore.getChangedBets().every((bet) => bet.scoreAway !== null && bet.scoreHome !== null),
);
const invalidBetsCount = computed(() => {
  const changes = matchesStore.getChangedBets();
  return changes.filter((bet) => bet.scoreAway === null || bet.scoreHome === null).length;
});
const saveButtonTooltip = computed(() => {
  if (!hasChanges.value) return 'Nenhuma alteração para salvar';
  if (allChangesAreValid.value) return 'Salvar apostas';
  return `${invalidBetsCount.value} ${invalidBetsCount.value === 1 ? 'aposta incompleta' : 'apostas incompletas'} - preencha todos os placares`;
});

// ------ Functions ------
const handleScroll = () => {
  if (!isDesktop) {
    return;
  }

  isScrolled.value = window.scrollY > 100;
};
const handleSave = async () => {
  const changes = matchesStore.getChangedBets().filter((bet) => bet.scoreAway !== null && bet.scoreHome !== null);

  if (hasChanges.value && !allChangesAreValid.value) {
    notificationStore.error('Apostas incompletas (em laranja) não podem ser salvas.', 'Apostas incompletas');
  }

  if (invalidBetsCount.value === 0 && changes.length === 0) {
    notificationStore.message('Nenhuma alteração para salvar', 'Sem alterações');
    return;
  }

  if (changes.length === 0) {
    return;
  }

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
  const newOption = matchListSorting.value === 'group' ? 'time' : 'group';
  configurationStore.setMatchListSorting(newOption);
};
</script>
<style scoped lang="scss">
@keyframes pulse {
  0%,
  100% {
    box-shadow:
      0 4px 12px rgb(0 0 0 / 15%),
      0 0 0 0 var(--bolao-c-mint-d1);
    transform: scale(1);
  }

  50% {
    box-shadow:
      0 8px 24px rgb(0 0 0 / 35%),
      0 0 0 10px color-mix(in srgb, var(--bolao-c-mint-d1) 20%, transparent);
    transform: scale(1.08);
  }
}

.floating-actions {
  position: fixed;
  top: 100px;
  left: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
  width: 70px;
  padding: var(--m-spacing) var(--xs-spacing);
  background-color: var(--bolao-c-blue3-t3);
  border-radius: var(--border-radius);
  transition: top 0.3s ease;

  &.scrolled {
    top: 20px;
  }

  @media (width <= 1024px) {
    inset: auto 0 0;
    flex-direction: row;
    justify-content: center;
    width: unset;
    padding: var(--m-spacing) 0 0 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    // background-color: var(--bolao-c-blue5-t3);

    &.scrolled {
      top: auto;
    }
  }
}

.button-outer {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
}

// ============================================
// Base Action Button Styles
// ============================================
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

  .pi {
    font-size: 1.25rem;
    color: var(--color-text);
    transition: color 0.3s ease;
  }

  // Interaction states
  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgb(0 0 0 / 25%);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &.disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  // Generic active state (for toggle buttons)
  &.active {
    background: linear-gradient(135deg, var(--bolao-c-fifa-green1), var(--bolao-c-fifa-blue));

    .pi {
      color: white;
    }
  }

  // Responsive sizing
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

// ============================================
// Save Button Variant
// ============================================
.action-btn.save-btn {
  position: relative;

  // No changes state (gray/default)
  &.no-changes {
    cursor: default;
    opacity: 0.6;

    &:hover {
      box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
      transform: none;
    }
  }

  // Valid changes state (green + pulse)
  &.has-valid-changes {
    background: var(--bolao-c-mint-d1);
    border-color: var(--bolao-c-mint-d2);
    animation: pulse 2s infinite;

    .pi {
      color: white;
    }

    &:hover:not(:disabled) {
      background: var(--bolao-c-mint-d2);
    }
  }

  // Invalid changes state (orange/yellow, no pulse)
  &.has-invalid-changes {
    background: var(--bolao-c-orange);
    border-color: var(--bolao-c-orange-d1);

    .pi {
      color: white;
    }

    &:hover:not(:disabled) {
      background: var(--bolao-c-orange-d1);
    }
  }
}

// Validation badge on save button
.validation-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 25%);
  transition: all 0.3s ease;

  &.valid {
    color: white;
    background: var(--bolao-c-fifa-green1);
  }

  &.invalid {
    color: white;
    background: var(--bolao-c-orange-d2);
  }

  @media (width <= 768px) {
    top: -3px;
    right: -3px;
    min-width: 18px;
    height: 18px;
    font-size: 0.65rem;
  }

  @media (width <= 480px) {
    top: -2px;
    right: -2px;
    min-width: 16px;
    height: 16px;
    font-size: 0.6rem;
  }
}

// ============================================
// Reset Button Variant
// ============================================
.action-btn.reset-btn {
  background: var(--bolao-c-red-l1);
  border-color: var(--bolao-c-red);

  .pi {
    color: white;
  }

  &:hover:not(:disabled) {
    background: var(--bolao-c-red);
  }
}
</style>
