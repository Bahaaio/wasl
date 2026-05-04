import api from "./client";
import { clearAccessToken, setAccessToken, setUser } from "../auth/store";

export const authApi = {
  register: async ({ username, email, password }) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    const token = data?.accessToken ?? data?.access_token;
    if (token) setAccessToken(token);
    if (data?.user) setUser(data.user);
  },

  login: async ({ username, password }) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    const token = data?.accessToken ?? data?.access_token;
    if (token) setAccessToken(token);
    if (data?.user) setUser(data.user);
  },

  logout: async () => {
    await api.post("/auth/logout");
    clearAccessToken();
  },
};
