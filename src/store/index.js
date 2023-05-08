import { createStore } from "vuex";
import axios from "axios";
import apiRoute from "../utils";

const store = createStore({
  state() {
    return {
      auth: {
        refresh_token: localStorage.getItem("refresh_token"),
        access_token: null,
        username: localStorage.getItem("username"),
        status: null,
      },
      count: 1,
    };
  },
  getters: {
    refresh: (state) => state.auth.refresh_token,
    acess: (state) => state.auth.access_token,
  },
  mutations: {
    auth_success(state, payload) {
      state.auth.access_token = payload.access_token;
      state.auth.refresh_token = payload.refresh_token;
      state.auth.username = payload.username;
      state.auth.status = "success";
    },
    auth_request(state) {
      state.auth.status = "loading";
    },
    auth_refresh(state, payload) {
      state.auth.access_token = payload.access;
    },
    auth_error(state) {
      state.auth.status = "error";
    },
    auth_logout(state) {
      state.auth.access_token = null;
      state.auth.refresh_token = null;
      state.auth.status = null;
      state.auth.username = null;
    },
  },
  actions: {
    async login({ commit }, user) {
      commit("auth_request");
      await axios
        .post(`${apiRoute["http"]}token-auth/`, {
          username: user.username,
          password: user.password,
        })
        .then((response) => {
          localStorage.refresh_token = response.data.refresh;
          localStorage.username = user.username;

          commit("auth_success", {
            access_token: response.data.access,
            refresh_token: response.data.refresh,
            username: user.username,
          });
        })
        .catch(() => {
          commit("auth_error");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");
        });
    },

    async register({ commit }, user) {
      commit("auth_request");
      await axios
        .post(`${apiRoute["http"]}api/user/register/`, {
          username: user.username,
          email: user.email,
          password1: user.password1,
          password2: user.password2,
        })
        .then((response) => {
          localStorage.refresh_token = response.data.refresh;
          localStorage.username = user.username;

          commit("auth_success", {
            access_token: response.data.access,
            refresh_token: response.data.refresh,
            username: user.username,
          });
        })
        .catch(() => {
          commit("auth_error");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");
        });
    },

    async logout({ commit }) {
      commit("auth_logout");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
    },

    async refresh(context) {
      context.commit("auth_request");
      let response = await axios.post(`${apiRoute["http"]}token-refresh/`, {
        refresh: context.state.auth.refresh_token,
      });
      context.commit("auth_refresh", response.data);
    },
  },
});
export default store;
