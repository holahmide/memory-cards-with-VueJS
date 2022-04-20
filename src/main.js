import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/index.css";

const app = createApp(App);

app.use(router);

app.mount("#app");

const useImage = (url) => {
  return new URL(`/src/${url}`, import.meta.url).href;
};

app.config.globalProperties.$image = useImage;

export default app;
