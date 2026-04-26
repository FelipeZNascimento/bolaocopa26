<template>
  <div class="outer">
    <ScoreComponent
      :is-score-modal-open="true"
      :match="match"
      :active-user-bet="match.loggedUserBets"
      :is-team-clickable="true"
      :is-match-started="isMatchStarted"
    />
    <ClockComponent
      style="margin-left: var(--l-spacing)"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="
        match.timestamp ? clockStore.getFormattedTime(match.timestamp) : null
      "
      :hit-level="hitLevel"
      :is-match-started="isMatchStarted"
    />
    <PrimeButton
      :icon="showMatchInfo ? 'pi pi-minus' : 'pi pi-plus'"
      class="match-info-toggle"
      label="Info"
      severity=""
      aria-label="Search"
      size="small"
      @click="toggleMatchInfo"
    />
  </div>
  <div header="Informações">
    <Transition name="expand">
      <div v-show="showMatchInfo" class="match-info-wrapper">
        <div class="match-info">
          <div class="info-section">
            <h3><i class="pi pi-building" /> Estádio</h3>
            <p class="info-title">
              {{ match.stadium.name }}
            </p>
            <p class="info-detail">
              {{ match.stadium.city }}, {{ match.stadium.country }}
            </p>
            <p class="info-detail">
              Capacidade:
              {{ match.stadium.capacity.toLocaleString("pt-BR") }} pessoas
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-user" /> Árbitro</h3>
            <p class="info-title">
              {{ match.referee.name }}
            </p>
            <p class="info-detail">
              {{ match.referee.country }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-calendar" /> Data e Hora</h3>
            <p class="info-title">
              {{ clockStore.getFormattedDate(match.timestamp) }}
            </p>
            <p class="info-detail">
              {{ clockStore.getFormattedTime(match.timestamp) }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-flag" /> Rodada</h3>
            <p class="info-title">
              {{ clockStore.getRoundName(match.round) }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

import type { HitLevel } from "@/constants/bets";
import type { IMatch } from "@/stores/matches.types";

import { useClockStore } from "@/stores/clock";

import ClockComponent from "../ClockComponent.vue";
import ScoreComponent from "../ScoreComponent.vue";

defineProps<{
  hitLevel: HitLevel | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const showMatchInfo = ref(false);

function toggleMatchInfo() {
  showMatchInfo.value = !showMatchInfo.value;
}
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  padding: var(--m-spacing);
  background-color: var(--bolao-c-blue3-t2);
  border-radius: var(--border-radius);
  margin: 0 var(--l-spacing) !important;
}

.match-info-toggle {
  display: flex;
  justify-content: center;
  height: var(--match-list-height);
  margin-left: var(--l-spacing);
  border-radius: var(--border-radius) !important;
}

.match-info-wrapper {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  max-height: 500px;
  opacity: 1;
  transition: all 0.4s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.match-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--l-spacing);
  padding: var(--l-spacing) 0;
}

.info-section {
  padding: var(--m-spacing);
  background-color: var(--bolao-c-blue3-t2);
  border-radius: var(--border-radius);
}

.info-section h3 {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  margin-bottom: var(--m-spacing);
  font-size: 0.9rem;
  color: var(--bolao-c-gold);
}

.info-section .info-title {
  margin-bottom: var(--s-spacing);
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--bolao-c-white);
}

.info-section .info-detail {
  margin-bottom: var(--xs-spacing);
  font-size: 0.9rem;
  color: var(--bolao-c-grey1-t2);
}
</style>
