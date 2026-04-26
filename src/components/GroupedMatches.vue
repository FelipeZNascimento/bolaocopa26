<template>
  <template v-if="shouldGroupByGroup">
    <div
      v-for="group in groupedMatches"
      :key="group.groupName"
      :class="`group-section group-${group.groupName.toLowerCase().split(' ')[1]}`"
    >
      <h2 class="group-header">
        {{ group.groupName }}
      </h2>
      <div class="outer-line-mode">
        <MatchComponent
          v-for="match in group.matches"
          :key="match.id"
          :is-match-clickable="!isTeamClickable"
          :is-team-clickable="isTeamClickable"
          :match="match"
        />
      </div>
    </div>
  </template>
  <div v-else :class="`group-section round-${selectedRound}`">
    <h2 class="group-header">
      {{ roundLabel }}
    </h2>
    <div class="outer-line-mode">
      <MatchComponent
        v-for="match in matches"
        :key="match.id"
        :is-match-clickable="!isTeamClickable"
        :is-team-clickable="isTeamClickable"
        :match="match"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

import type { IMatch } from "@/stores/matches.types";

import MatchComponent from "@/components/Match/MatchComponent.vue";

const props = withDefaults(
  defineProps<{
    isTeamClickable?: boolean;
    matches: IMatch[];
    selectedRound: null | number;
  }>(),
  {
    isTeamClickable: false,
  },
);

const shouldGroupByGroup = computed(() => {
  const round = props.selectedRound;
  return round === 1 || round === 2 || round === 3;
});

const roundLabel = computed(() => {
  const round = props.selectedRound;
  if (round === null) {
    return "";
  }

  const labels: Record<number, string> = {
    1: "Fase de Grupos - Rodada 1",
    2: "Fase de Grupos - Rodada 2",
    3: "Fase de Grupos - Rodada 3",
    4: "16 Avos",
    5: "Oitavas",
    6: "Quartas",
    7: "Semi Finais",
    8: "Final",
  };
  return labels[round] || `Rodada ${round}`;
});

const groupedMatches = computed(() => {
  const groups = new Map<string, IMatch[]>();

  props.matches.forEach((match) => {
    const groupKey = match.homeTeam.group;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(match);
  });

  // Sort groups alphabetically and convert to array
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, matches]) => ({
      groupName: `Grupo ${groupName}`,
      matches,
    }));
});
</script>
<style lang="scss" scoped>
.outer-line-mode {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--m-spacing);

  @media (width <= 768px) {
    padding: var(--xs-spacing);
  }
}

.group-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  color: var(--color-contrast);
  border-radius: 8px;
  box-shadow: var(--drop-shadow);
}

.group-section::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: "";
}

.group-section:hover .group-header::after {
  position: absolute;
  top: 0;
  left: -200px;
  width: 200px;
  height: 100%;
  content: "";
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, currentcolor 20%, transparent) 50%,
    transparent 100%
  );
}

.group-header {
  position: relative;
  z-index: 1;
  padding: var(--s-spacing);
  padding-left: var(--l-spacing);
  overflow: hidden;
  font-size: var(--l-font-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
}

.groups-container {
  width: 100%;
}

.group-fade-enter-active,
.group-fade-leave-active {
  transition: all 0.5s ease;
}

.group-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.group-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.group-fade-move {
  transition: transform 0.5s ease;
}

.group-a {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-green1);
}

.group-a .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-green1);
}

.group-b {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-red);
}

.group-b .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-red);
}

.group-c {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-green2);
}

.group-c .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-yellow);
}

.group-d {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-blue);
}

.group-d .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-blue);
}

.group-e {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-orange);
}

.group-e .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-orange);
}

.group-f {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-green2);
}

.group-f .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-green2);
}

.group-g {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-lilac);
}

.group-g .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-lilac);
}

.group-h {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green3) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-green3);
}

.group-h .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green3) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-green3);
}

.group-i {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-purple);
}

.group-i .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-purple);
}

.group-j {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-lightpink);
}

.group-j .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-lightpink);
}

.group-k {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.group-k .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-pink);
}

.group-l {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-darkred);
}

.group-l .group-header {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
    transparent 100%
  );
  border-left: 4px solid var(--bolao-c-fifa-darkred);
}

.round-4 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.round-5 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.round-6 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.round-7 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.round-8 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}

.round-9 {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
  border-color: var(--bolao-c-fifa-pink);
}
</style>
