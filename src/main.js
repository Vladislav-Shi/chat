import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import apiRoute from "./utils";
import store from "./store";

const app = createApp(App);

app.use(router);
app.use(apiRoute);
app.use(store);
app.use(VueAxios, axios);

app.mount("#app");
