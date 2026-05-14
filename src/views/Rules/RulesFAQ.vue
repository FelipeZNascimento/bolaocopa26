<template>
  <div
    id="faq"
    style="width: 100%"
  >
    <div
      v-for="question in FAQs"
      :id="question.slug"
      :key="question.slug"
    >
      <PrimePanel
        toggleable
        class="outer"
        :collapsed="!openSlugs.includes(question.slug)"
        :pt="{
          header: { style: 'cursor: pointer', onClick: () => toggleSlug(question.slug, openSlugs.includes(question.slug)) },
          pcToggleButton: { root: { onClick: (e: MouseEvent) => e.stopPropagation() } },
        }"
        @update:collapsed="(val: boolean) => toggleSlug(question.slug, val)"
      >
        <template #header>
          <h3>{{ question.question }}</h3>
        </template>

        <p v-if="typeof question.answer === 'string'">{{ question.answer }}</p>
        <p v-else>
          <template
            v-for="(segment, i) in question.answer"
            :key="i"
          >
            <RouterLink
              v-if="segment.type === 'link'"
              :to="segment.to"
              >{{ segment.text }}</RouterLink
            >
            <template v-else>{{ segment.text }}</template>
          </template>
        </p>
      </PrimePanel>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

type FAQItem = {
  answer: (LinkSegment | TextSegment)[] | string;
  question: string;
  slug: string;
};
type LinkSegment = { text: string; to: string; type: 'link' };
type TextSegment = { text: string; type: 'text' };

const FAQs: FAQItem[] = [
  {
    answer: [
      {
        text: 'As apostas podem ser alteradas a qualquer momento antes do início de cada jogo. Para alterar uma aposta, basta encontrar a partida na seção ',
        type: 'text',
      },
      { text: 'Jogos', to: '/jogos', type: 'link' },
      {
        text: ' e fazer as alterações desejadas. Lembre-se de salvar as alterações para que elas sejam registradas. Após o início do jogo, as apostas ficam bloqueadas e não podem mais ser modificadas.',
        type: 'text',
      },
    ],
    question: 'Posso alterar minhas apostas depois de feitas?',
    slug: 'alterar-apostas',
  },
  {
    answer: [
      {
        text: 'Sim! Somente as partidas já finalizadas não poderão mais receber apostas. Para as partidas futuras, você pode fazer suas apostas normalmente, mesmo que tenha perdido a oportunidade de apostar em uma partida anterior.',
        type: 'text',
      },
    ],
    question: 'Se eu não apostar numa partida, posso apostar nas próximas?',
    slug: 'apostar-proximas',
  },
  {
    answer: [
      {
        text: 'Se você está logado e já confirmou o seu pagamento com os administradores, mas ainda não consegue fazer suas apostas, por favor, entre em contato com um dos administradores para que possamos resolver o problema o mais rápido possível. Em último caso, você pode suas apostas por e-mail, conforme descrito na seção de Apostas.',
        type: 'text',
      },
    ],
    question: 'Não consigo fazer minhas apostas, e agora?',
    slug: 'nao-consigo-apostar',
  },
];

const route = useRoute();
const router = useRouter();

const faqParam = route.query.faq as string | undefined;
const sectionParam = route.query.section as string | undefined;

const openSlugs = ref<string[]>(faqParam && FAQs.some((f) => f.slug === faqParam) ? [faqParam] : []);

function toggleSlug(slug: string, collapsed: boolean) {
  if (collapsed) {
    openSlugs.value = openSlugs.value.filter((s) => s !== slug);
    const query = { ...route.query };
    if (query.faq === slug) delete query.faq;
    router.replace({ query });
  } else {
    openSlugs.value.push(slug);
    router.replace({ query: { ...route.query, faq: slug } });
  }
}

onMounted(async () => {
  await nextTick();
  if (faqParam && FAQs.some((f) => f.slug === faqParam)) {
    document.getElementById(faqParam)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (sectionParam === 'faq') {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
</script>
<style lang="scss" scoped>
.outer {
  width: 100%;
  font-size: var(--m-font-size);

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }

  p {
    padding-top: var(--xs-spacing);
    line-height: 1.5;
  }

  .padded {
    padding-left: var(--xl-spacing);
  }

  .double-padded {
    padding-left: var(--xxl-spacing);
  }
}

i {
  margin-right: var(--s-spacing);
}
</style>
