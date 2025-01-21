import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/css/index.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css"; // PrimeIcons 스타일 추가
import Tooltip from "primevue/tooltip";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.directive("tooltip", Tooltip);
app.mount("#app");
