<template>
  <template v-if="shouldGroupByGroup">
    <div
      v-for="group in groupedMatches"
      :key="group.groupName"
      :class="`group-section group-${group.groupName.toLowerCase().split(' ')[1]}`"
    >
      <h2 class="group-header">{{ group.groupName }}</h2>
      <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
        <MatchComponent
          v-for="match in group.matches"
          :isBetting="isBetting"
          :isGridMode="view === 'grid'"
          :match="match"
          :key="match.id"
        />
      </div>
    </div>
  </template>
  <div v-else :class="`group-section round-${selectedRound}`">
    <h2 class="group-header">{{ roundLabel }}</h2>
    <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
      <MatchComponent
        v-for="match in matches"
        :isBetting="isBetting"
        :isGridMode="view === 'grid'"
        :match="match"
        :key="match.id"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { IMatch } from '@/stores/matches.types';

import MatchComponent from '@/components/Match/MatchComponent.vue';

const props = withDefaults(
  defineProps<{
    isBetting?: boolean;
    matches: IMatch[];
    selectedRound: null | number;
    view: 'grid' | 'lines';
  }>(),
  {
    isBetting: false,
  },
);

const shouldGroupByGroup = computed(() => {
  const round = props.selectedRound;
  return round === 1 || round === 2 || round === 3;
});

const roundLabel = computed(() => {
  const round = props.selectedRound;
  if (round === null) {
    return '';
  }

  const labels: Record<number, string> = {
    1: 'Fase de Grupos - Rodada 1',
    2: 'Fase de Grupos - Rodada 2',
    3: 'Fase de Grupos - Rodada 3',
    4: '16 Avos',
    5: 'Oitavas',
    6: 'Quartas',
    7: 'Semi Finais',
    8: 'Final',
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
  padding: var(--m-spacing);
  gap: var(--m-spacing);
}

.group-section {
  box-shadow: var(--drop-shadow);
  width: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  color: var(--color-contrast);
}

.group-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
}

.group-section:hover .group-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: -200px;
  width: 200px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, currentColor 20%, transparent) 50%,
    transparent 100%
  );
}

.group-header {
  font-size: var(--l-font-size);
  font-weight: 700;
  padding: var(--s-spacing);
  padding-left: var(--l-spacing);
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  overflow: hidden;
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
  border-color: var(--bolao-c-fifa-green1);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-a .group-header {
  border-left: 4px solid var(--bolao-c-fifa-green1);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green1) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-b {
  border-color: var(--bolao-c-fifa-red);
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%, transparent 100%);
}

.group-b .group-header {
  border-left: 4px solid var(--bolao-c-fifa-red);
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-fifa-red) 15%, transparent) 0%, transparent 100%);
}

.group-c {
  border-color: var(--bolao-c-fifa-green2);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-c .group-header {
  border-left: 4px solid var(--bolao-c-fifa-yellow);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-yellow) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-d {
  border-color: var(--bolao-c-fifa-blue);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-d .group-header {
  border-left: 4px solid var(--bolao-c-fifa-blue);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-blue) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-e {
  border-color: var(--bolao-c-orange);
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%, transparent 100%);
}

.group-e .group-header {
  border-left: 4px solid var(--bolao-c-orange);
  background: linear-gradient(90deg, color-mix(in srgb, var(--bolao-c-orange) 15%, transparent) 0%, transparent 100%);
}

.group-f {
  border-color: var(--bolao-c-fifa-green2);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-f .group-header {
  border-left: 4px solid var(--bolao-c-fifa-green2);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green2) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-g {
  border-color: var(--bolao-c-lilac);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-g .group-header {
  border-left: 4px solid var(--bolao-c-fifa-lilac);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lilac) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-h {
  border-color: var(--bolao-c-fifa-green3);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green3) 15%, transparent) 0%,
    transparent 100%
  );
}
.group-h .group-header {
  border-left: 4px solid var(--bolao-c-fifa-green3);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-green3) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-i {
  border-color: var(--bolao-c-fifa-purple);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
}
.group-i .group-header {
  border-left: 4px solid var(--bolao-c-fifa-purple);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-purple) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-j {
  border-color: var(--bolao-c-fifa-lightpink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
    transparent 100%
  );
}
.group-j .group-header {
  border-left: 4px solid var(--bolao-c-fifa-lightpink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-lightpink) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-k {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.group-k .group-header {
  border-left: 4px solid var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}

.group-l {
  border-color: var(--bolao-c-fifa-darkred);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
    transparent 100%
  );
}
.group-l .group-header {
  border-left: 4px solid var(--bolao-c-fifa-darkred);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-darkred) 15%, transparent) 0%,
    transparent 100%
  );
}

.round-4 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.round-5 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.round-6 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.round-7 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.round-8 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
.round-9 {
  border-color: var(--bolao-c-fifa-pink);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-fifa-pink) 15%, transparent) 0%,
    transparent 100%
  );
}
</style>
