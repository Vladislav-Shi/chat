import { createWebHistory, createRouter } from "vue-router";


import HomePage from "../components/HomePage.vue";
import ChatWindows from "../components/ChatWindows.vue";
import LoginPage from "../components/LoginPage.vue";
import RegisterPage from "../components/RegisterPage.vue";


const routes = [
  { path: "", component: HomePage },
  { path: "/chat/:id", component: ChatWindows },
  { path: "/signin", component: LoginPage },
  { path: "/signup", component: RegisterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
