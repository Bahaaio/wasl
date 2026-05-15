import api from "./client";
import { clearAccessToken, setAccessToken, setUser } from "../auth/store";

/** @typedef {import("./types").AuthResponse} AuthResponse */
/** @typedef {import("./types").RegisterRequest} RegisterRequest */
/** @typedef {import("./types").LoginRequest} LoginRequest */

/**
 * @param {AuthResponse} data
 * @returns {void}
 */
const readAuthResponse = data => {
  setAccessToken(data.accessToken);
  setUser(data.user);
};

export const authApi = {
  /**
   * @param {RegisterRequest} request
   * @returns {Promise<void>}
   */
  register: async request => {
    const { data } = await api.post("/auth/register", request);

    readAuthResponse(data);
  },

  /**
   * @param {LoginRequest} request
   * @returns {Promise<void>}
   */
  login: async request => {
    const { data } = await api.post("/auth/login", request);

    readAuthResponse(data);
  },

  /**
   * @returns {Promise<void>}
   */
  logout: async () => {
    await api.post("/auth/logout");

    clearAccessToken();
    setUser(null);
  },
};
