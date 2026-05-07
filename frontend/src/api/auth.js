import api from "./client";
import { clearAccessToken, setAccessToken, setUser } from "../auth/store";

const readAuthResponse = data => {
  setAccessToken(data.accessToken);
  setUser(data.user);
};

export const authApi = {
  register: async ({ username, email, password }) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    readAuthResponse(data);
  },

  login: async ({ username, password }) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    readAuthResponse(data);
  },

  logout: async () => {
    await api.post("/auth/logout");

    clearAccessToken();
    setUser(null);
  },
};
