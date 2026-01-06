import './assets/main.scss';

/* ---- FontAwesome Config ---- */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeAutocomplete from 'primevue/autocomplete';
// Componentss
/* ---- PrimeVue ---- */
import PrimeAvatar from 'primevue/avatar';
import PrimeButton from 'primevue/button';
import PrimeChart from 'primevue/chart';
import PrimeColorPicker from 'primevue/colorpicker';
import PrimeColumn from 'primevue/column';
import PrimeVue from 'primevue/config';
import PrimeDataTable from 'primevue/datatable';
import PrimeDialog from 'primevue/dialog';
import PrimeDivider from 'primevue/divider';
import PrimeFloatLabel from 'primevue/floatlabel';
import PrimeInputText from 'primevue/inputtext';
import PrimeKnob from 'primevue/knob';
import PrimeMenubar from 'primevue/menubar';
import PrimeMessage from 'primevue/message';
import PrimeOverlayBadge from 'primevue/overlaybadge';
import PrimePaginator from 'primevue/paginator';
import PrimePanel from 'primevue/panel';
import PrimePassword from 'primevue/password';
import PrimePopover from 'primevue/popover';
import PrimeRadioButton from 'primevue/radiobutton';
import PrimeRadioButtonGroup from 'primevue/radiobuttongroup';
import PrimeSelectButton from 'primevue/selectbutton';
import PrimeSkeleton from 'primevue/skeleton';
import PrimeTag from 'primevue/tag';
import PrimeToast from 'primevue/toast';
import PrimeToastService from 'primevue/toastservice';
import PrimeToggleSwitch from 'primevue/toggleswitch';
import PrimeTooltip from 'primevue/tooltip';
/* ---- PrimeVue ---- */
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

library.add(fas, fab, far);
/* ---- FontAwesome Config ---- */

const app = createApp(App);

app.use(createPinia());
app.use(router);

/* ---- PrimeVue ---- */
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});

app.use(PrimeVue, {
  theme: {
    options: {
      darkModeSelector: '.dark-mode',
    },
    preset: MyPreset,
  },
});

app.use(PrimeToastService);

app.component('PrimeButton', PrimeButton);
app.component('PrimeDialog', PrimeDialog);
app.component('PrimeInputText', PrimeInputText);
app.component('PrimeMessage', PrimeMessage);
app.component('PrimePassword', PrimePassword);
app.component('PrimeFloatLabel', PrimeFloatLabel);
app.component('PrimePopover', PrimePopover);
app.component('PrimeDataTable', PrimeDataTable);
app.component('PrimeColumn', PrimeColumn);
app.component('PrimeSelectButton', PrimeSelectButton);
app.component('PrimeToggleSwitch', PrimeToggleSwitch);
app.component('PrimeSkeleton', PrimeSkeleton);
app.component('PrimePaginator', PrimePaginator);
app.component('PrimeAutocomplete', PrimeAutocomplete);
app.component('PrimeTag', PrimeTag);
app.component('PrimeColorPicker', PrimeColorPicker);
app.component('PrimeToast', PrimeToast);
app.component('PrimeRadioButton', PrimeRadioButton);
app.component('PrimeRadioButtonGroup', PrimeRadioButtonGroup);
app.component('PrimeDivider', PrimeDivider);
app.component('PrimeMenubar', PrimeMenubar);
app.component('PrimeAvatar', PrimeAvatar);
app.component('PrimeKnob', PrimeKnob);
app.component('PrimeOverlayBadge', PrimeOverlayBadge);
app.component('PrimePanel', PrimePanel);
app.component('PrimeChart', PrimeChart);

app.directive('tooltip', PrimeTooltip);

/* ---- PrimeVue ---- */

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
