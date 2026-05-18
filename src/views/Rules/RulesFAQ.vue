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
          header: {
            style: 'cursor: pointer',
            onClick: () => toggleSlug(question.slug, openSlugs.includes(question.slug)),
          },
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
            <template v-else-if="segment.type === 'image'">
              <img
                :src="segment.url"
                :alt="segment.alt"
                style="max-width: 100%; height: auto; max-height: 300px; padding: var(--s-spacing); cursor: zoom-in"
                @click="openImage(segment.url, segment.alt)"
              />
            </template>
            <template v-else
              ><p>{{ segment.text }}</p></template
            >
          </template>
        </p>
      </PrimePanel>
    </div>
  </div>

  <PrimeDialog
    v-model:visible="lightbox.visible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ maxWidth: '90vw', width: 'fit-content' }"
  >
    <template #header><span /></template>
    <img
      :src="lightbox.url"
      :alt="lightbox.alt"
      style="display: block; max-width: 85vw; max-height: 85vh"
    />
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';

type FAQItem = {
  answer: (ImageSegment | LinkSegment | TextSegment)[] | string;
  question: string;
  slug: string;
};
type ImageSegment = { alt: string; type: 'image'; url: string };
type LinkSegment = { text: string; to: string; type: 'link' };
type TextSegment = { text: string; type: 'text' };

const { t } = useI18n();

const FAQs = computed<FAQItem[]>(() => [
  {
    answer: [
      { text: t('rules.faqItems.pwaInstall.answer1'), type: 'text' },
      {
        alt: t('rules.faqItems.pwaInstall.answerLinkAlt'),
        type: 'image',
        url: '/pwa-desktop.png',
      },
      { text: t('rules.faqItems.pwaInstall.answer2'), type: 'text' },
      {
        alt: t('rules.faqItems.pwaInstall.answerLinkAlt'),
        type: 'image',
        url: '/pwa-mobile1.png',
      },
      {
        alt: t('rules.faqItems.pwaInstall.answerLinkAlt'),
        type: 'image',
        url: '/pwa-mobile2.png',
      },
    ],
    question: t('rules.faqItems.pwaInstall.question'),
    slug: 'pwa-install',
  },
  {
    answer: [
      { text: t('rules.faqItems.changeAfterBet.answer1'), type: 'text' },
      { text: t('rules.faqItems.changeAfterBet.answerLink'), to: '/jogos', type: 'link' },
      { text: t('rules.faqItems.changeAfterBet.answer2'), type: 'text' },
    ],
    question: t('rules.faqItems.changeAfterBet.question'),
    slug: 'alterar-apostas',
  },
  {
    answer: [{ text: t('rules.faqItems.missedBet.answer'), type: 'text' }],
    question: t('rules.faqItems.missedBet.question'),
    slug: 'apostar-proximas',
  },
  {
    answer: [{ text: t('rules.faqItems.cantBet.answer'), type: 'text' }],
    question: t('rules.faqItems.cantBet.question'),
    slug: 'nao-consigo-apostar',
  },
  {
    answer: [{ text: t('rules.faqItems.drawBet.answer'), type: 'text' }],
    question: t('rules.faqItems.drawBet.question'),
    slug: 'apostar-empate',
  },
  {
    answer: [{ text: t('rules.faqItems.removeBet.answer'), type: 'text' }],
    question: t('rules.faqItems.removeBet.question'),
    slug: 'remover-aposta',
  },
  {
    answer: [{ text: t('rules.faqItems.emptyBet.answer'), type: 'text' }],
    question: t('rules.faqItems.emptyBet.question'),
    slug: 'aposta-vazia',
  },
]);

const route = useRoute();
const router = useRouter();

const faqParam = route.query.faq as string | undefined;
const sectionParam = route.query.section as string | undefined;

const openSlugs = ref<string[]>(faqParam && FAQs.value.some((f) => f.slug === faqParam) ? [faqParam] : []);

const lightbox = ref({ alt: '', url: '', visible: false });

function openImage(url: string, alt: string) {
  lightbox.value = { alt, url, visible: true };
}

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
  if (faqParam && FAQs.value.some((f) => f.slug === faqParam)) {
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
