<template>
  <div class="social-widget">
    <p class="tagline">{{ t('home.socialGroups.tagline') }}</p>

    <div class="links">
      <a
        class="social-link social-link--whatsapp"
        href="https://chat.whatsapp.com/EsOlEuAXMeIB6rf8Rq2oBc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="link-bg" />
        <div class="link-inner">
          <i class="pi pi-whatsapp link-icon" />
          <div class="link-text">
            <span class="link-title">WhatsApp</span>
            <span class="link-sub">{{ t('home.socialGroups.joinGroup') }}</span>
          </div>
          <i class="pi pi-arrow-up-right link-arrow" />
        </div>
      </a>

      <a
        class="social-link social-link--telegram"
        href="https://t.me/+rVP220dgf2o0ZDJh"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="link-bg" />
        <div class="link-inner">
          <i class="pi pi-telegram link-icon" />
          <div class="link-text">
            <span class="link-title">Telegram</span>
            <span class="link-sub">{{ t('home.socialGroups.joinGroup') }}</span>
          </div>
          <i class="pi pi-arrow-up-right link-arrow" />
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.social-widget {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  height: 100%;
}

.tagline {
  font-size: var(--s-font-size);
  line-height: 1.6;
  color: var(--bolao-c-grey2);
}

.links {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--s-spacing);
}

// ---- Link card ----
.social-link {
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    .link-bg {
      opacity: 1;
    }

    .link-arrow {
      transform: translate(2px, -2px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  // Per-platform colours
  &--whatsapp {
    box-shadow: 0 0 0 1px color-mix(in srgb, #25d366 35%, transparent);

    .link-bg {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, #25d366 18%, transparent),
        color-mix(in srgb, #128c7e 10%, transparent)
      );
    }

    .link-icon {
      color: #25d366;
    }

    &:hover {
      box-shadow: 0 4px 20px color-mix(in srgb, #25d366 25%, transparent);
    }
  }

  &--telegram {
    box-shadow: 0 0 0 1px color-mix(in srgb, #2aabee 35%, transparent);

    .link-bg {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, #2aabee 18%, transparent),
        color-mix(in srgb, #1d7eb3 10%, transparent)
      );
    }

    .link-icon {
      color: #2aabee;
    }

    &:hover {
      box-shadow: 0 4px 20px color-mix(in srgb, #2aabee 25%, transparent);
    }
  }
}

// Subtle background fill — fades in on hover
.link-bg {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  transition: opacity 0.25s ease;
}

// Content sits above the bg layer
.link-inner {
  position: relative;
  display: flex;
  gap: var(--m-spacing);
  align-items: center;
  width: 100%;
  padding: var(--m-spacing) var(--l-spacing);
}

.link-icon {
  flex-shrink: 0;
  font-size: var(--xl-font-size);
}

.link-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.link-title {
  font-size: var(--s-font-size);
  font-weight: 700;
  color: var(--bolao-c-grey2);
}

.link-sub {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.link-arrow {
  flex-shrink: 0;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
  transition:
    transform 0.2s ease,
    color 0.2s ease;

  .social-link:hover & {
    color: var(--p-text-color);
  }
}
</style>
