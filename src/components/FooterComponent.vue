<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-section">
        <h3 class="section-title">{{ t('footer.about.title') }}</h3>
        <p class="about-text">{{ t('footer.about.description') }}</p>
      </div>
      <div class="footer-section">
        <h3 class="section-title">{{ t('footer.contact.title') }}</h3>
        <ul class="contact-list">
          <li>
            <a
              class="contact-link"
              href="https://chat.whatsapp.com/EsOlEuAXMeIB6rf8Rq2oBc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="pi pi-whatsapp" />
              {{ t('footer.contact.whatsapp') }}
            </a>
          </li>
          <li>
            <a
              class="contact-link"
              href="https://t.me/+rVP220dgf2o0ZDJh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="pi pi-telegram" />
              {{ t('footer.contact.telegram') }}
            </a>
          </li>
          <li>
            <a
              class="contact-link"
              href="mailto:bolaocopa@omegafox.me"
            >
              <i class="pi pi-envelope" />
              {{ t('footer.contact.email') }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>{{ t('footer.copyright', { year: currentYear }) }}</span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const currentYear = computed(() => new Date().getFullYear());
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100vw;
  margin-top: auto;
  margin-left: calc(50% - 50vw);
  color: var(--bolao-c-grey2);
  background-color: var(--bolao-c-navbar);
  border-top: 8px solid var(--bolao-c-gold);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--xl-spacing);
  justify-content: center;
  max-width: 960px;
  padding: var(--xl-spacing) var(--l-spacing);
  margin: 0 auto;

  @media (width <= 768px) {
    flex-direction: column;
    gap: var(--l-spacing);
  }
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.section-title {
  margin-bottom: var(--s-spacing);
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--p-text-color);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.about-text {
  font-size: var(--xs-font-size);
  line-height: 1.6;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding: 0;
  margin: 0;
  list-style: none;
}

.contact-link {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey2);
  text-decoration: none;
  transition: color 0.2s;

  .pi {
    font-size: var(--s-font-size);
  }

  &:hover {
    color: var(--p-text-color);
  }
}

.footer-bottom {
  padding: var(--s-spacing) var(--l-spacing);
  font-size: var(--xxs-font-size);
  text-align: center;
  border-top: 1px solid var(--bolao-c-blue3);
}
</style>
