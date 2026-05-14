import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useRulesPanel(slug: string) {
  const route = useRoute();
  const router = useRouter();
  const isOpen = ref(route.query.section === slug);

  const panelPt = {
    header: {
      style: 'cursor: pointer',
      onClick: () => {
        isOpen.value = !isOpen.value;
      },
    },
    pcToggleButton: {
      root: { onClick: (e: MouseEvent) => e.stopPropagation() },
    },
  };

  watch(isOpen, (open) => {
    const query = { ...route.query };
    if (open) {
      query.section = slug;
    } else if (query.section === slug) {
      delete query.section;
    }
    router.replace({ query });
  });

  onMounted(async () => {
    if (route.query.section === slug) {
      await nextTick();
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return { isOpen, panelPt };
}
